import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post('complete')
  async complete(@Body() body: { 
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>; 
    groundWithPosts?: boolean; // optional flag from client to choose grounding mode
  }) {
    const apiKey = process.env.AZURE_OPENAI_API_KEY as string;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT as string; // https://<resource>.openai.azure.com
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT as string; // your deployment name
    const apiVersion = (process.env.AZURE_OPENAI_API_VERSION as string) || undefined;

    if (!apiKey || !endpoint || !deployment) {
      throw new Error('Azure OpenAI environment variables are missing');
    }

    const result = await this.chat.complete({
      apiKey,
      endpoint,
      deployment,
      apiVersion,
      messages: body.messages || [],
      groundWithPosts: body.groundWithPosts !== undefined ? body.groundWithPosts : true,
    });

    return { content: result.content };
  }
}
