import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from 'src/models/post.model';

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
