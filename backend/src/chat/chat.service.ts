import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from 'src/models/post.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Post) private readonly postModel: typeof Post,
  ) {}

  async complete(opts: {
    apiKey: string;
    endpoint: string; // e.g., https://<resource>.openai.azure.com
    deployment: string; // model deployment name
    apiVersion?: string; // default 2024-02-15-preview
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    groundWithPosts?: boolean; // when true, pull posts and ground the response
  }) {
    const { apiKey, endpoint, deployment, messages, groundWithPosts, apiVersion = '2024-02-15-preview' } = opts;

    let finalMessages = messages;
    if (groundWithPosts) {
      const posts = await this.postModel.findAll({ order: [['date', 'DESC']], limit: 50 });
      const snippets = posts.map(p => `Title: ${p.title}\nDate: ${p.date}\nContent: ${truncate(p.content, 1200)}`).join('\n\n---\n\n');
    const system = {
        role: 'system' as const,
        content:
          'You are a helpful assistant for the SecondBrain app. Answer ONLY using the provided blog posts context. If the answer is not in the context, reply exactly with the token: NO_ANSWER (and nothing else). Keep responses concise and include the post title when useful. Context follows:\n\n' + snippets,
      };
      finalMessages = [system, ...messages.filter(m => m.role !== 'system')];
    }

    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: finalMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    } as any);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Azure OpenAI error ${res.status}: ${text}`);
    }

    const data = await res.json();
    let content = data?.choices?.[0]?.message?.content ?? '';
    if (groundWithPosts) {
      const normalized = content.trim().toUpperCase();
      if (normalized === 'NO_ANSWER' || normalized.startsWith('NO_ANSWER')) {
        content = 'לא הצלחתי למצוא מידע מתאים באתר, תרצה שאבדוק לך במקורות אחרים?';
      }
    }
    return { content, raw: data };
  }
}

function truncate(text: string | undefined, max: number) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
}
