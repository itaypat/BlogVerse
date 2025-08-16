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
      // Provide lightweight contextual snippets without rigid labels to encourage natural referencing.
      const snippets = posts.map(p => `כותרת: ${p.title}\nתאריך: ${p.date}\n${truncate(p.content, 1200)}`).join('\n\n---\n\n');
      const system = {
        role: 'system' as const,
        content:
          'You are an assistant for a notes/blog knowledge base. RULES:\n' +
          '- Use ONLY the provided posts context below.\n' +
          '- If the answer is not present, reply exactly: NO_ANSWER\n' +
          '- Answer in the same language as the user.\n' +
          '- Write naturally. Do NOT start with a standalone title line. Do NOT wrap titles with ** **.\n' +
          '- When helpful, refer to a source like: "לפי הפוסט על X" or "על פי הפוסט בנושא Y" inside a sentence (not as a heading).\n' 
          // '- Keep it concise and conversational.\n' +
          // 'CONTEXT START\n' + snippets + '\nCONTEXT END',
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
