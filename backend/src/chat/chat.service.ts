import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from 'src/models/post.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Post) private readonly postModel: typeof Post,
  ) {}

  async complete(opts: CompleteOptions) {
    const { apiKey, endpoint, deployment, apiVersion = '2024-02-15-preview' } = opts;

    // Derive explicit mode. Preference order: opts.mode -> legacy groundWithPosts flag.
    const mode: ChatMode = opts.mode
      ? opts.mode
      : opts.groundWithPosts === false
        ? 'dynamic'
        : 'strict'; // default strict for backwards compatibility

    const baseMessages = opts.messages || [];
    const preparedMessages = mode === 'strict'
      ? await this.prepareStrictMessages(baseMessages)
      : await this.prepareDynamicMessages(baseMessages);

    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
    const payload = {
      messages: preparedMessages,
      temperature: mode === 'dynamic' ? 0.8 : 0.4, // a bit more creative in dynamic
      max_tokens: 500,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    } as any);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Azure OpenAI error ${res.status}: ${text}`);
    }

    const data = await res.json();
    let content = data?.choices?.[0]?.message?.content ?? '';

    if (mode === 'strict') {
      const normalized = content.trim().toUpperCase();
      if (normalized === 'NO_ANSWER' || normalized.startsWith('NO_ANSWER')) {
        content = 'לא הצלחתי למצוא מידע מתאים באתר, תרצה שאבדוק לך במקורות אחרים?';
      }
    }

    return { content, raw: data, mode };
  }

  /** Strict mode: inject system prompt with grounded posts context */
  private async prepareStrictMessages(userMessages: Message[]): Promise<Message[]> {
    const posts = await this.postModel.findAll({ order: [['date', 'DESC']], limit: 50 });
    const snippets = posts.map(p => {
      const plain = stripHtml(p.content);
      return `כותרת: ${p.title}\nתאריך: ${p.date}\n${truncate(plain, 1200)}`;
    }).join('\n\n---\n\n');
    const system: Message = {
      role: 'system',
      content: [
        'You are an assistant for a notes/blog knowledge base.',
        'MODE: STRICT (use only provided posts).',
        'RULES:',
        '- Use ONLY the provided posts context below.',
        '- If the answer is not present, reply exactly: NO_ANSWER',
        '- Answer in the same language as the user.',
        // '- Write naturally – no standalone title line; refer inline: לפי הפוסט "שם הפוסט" ',
        // '- Be concise and conversational.',
        'CONTEXT START',
        snippets,
        'CONTEXT END'
      ].join('\n')
    };
    // Remove any previous system messages from userMessages to avoid duplication.
    return [system, ...userMessages.filter(m => m.role !== 'system')];
  }

  /** Dynamic mode: general knowledge PLUS optional posts context (not restrictive). */
  private async prepareDynamicMessages(userMessages: Message[]): Promise<Message[]> {
    const posts = await this.postModel.findAll({ order: [['date', 'DESC']], limit: 30 });
    const snippets = posts.map(p => {
      const plain = stripHtml(p.content);
      return `כותרת: ${p.title}\n${truncate(plain, 600)}`;
    }).join('\n\n---\n\n');
    const dynamicSystem: Message = {
      role: 'system',
      content: [
        'You are a helpful assistant (MODE: DYNAMIC).',
        'You may use BOTH the optional posts context below AND broader world knowledge.',
        'Prefer, when relevant, to ground answers on the posts ("לפי הפוסט על ..."), but you are not forced to.',
        'Write naturally; no standalone title line.',
        '- Answer in the same language as the user main prompt (english / hebrew). ',
        'OPTIONAL CONTEXT START',
        snippets,
        'OPTIONAL CONTEXT END'
      ].join('\n')
    };
    return [dynamicSystem, ...userMessages.filter(m => m.role !== 'system')];
  }
}

// ---------------------- Types & Helpers ----------------------
export type ChatMode = 'strict' | 'dynamic';

export interface Message { role: 'system' | 'user' | 'assistant'; content: string }

export interface CompleteOptions {
  apiKey: string;
  endpoint: string;
  deployment: string;
  apiVersion?: string;
  messages: Message[];
  groundWithPosts?: boolean; // legacy flag (true => strict)
  mode?: ChatMode; // preferred new explicit mode
}

function truncate(text: string | undefined, max: number) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
}

function stripHtml(html?: string) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
