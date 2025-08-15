import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes it available everywhere
    }),
  SequelizeModule.forRoot({
    dialect: 'postgres', // PostgreSQL dialect
    uri: process.env.DATABASE_URL, // Replace with your actual URL
    models: [], // Your Sequelize models
    autoLoadModels: true,
    synchronize: true, // In dev, keep true; in prod prefer migrations
    sync: { alter: true }, // Auto update schema to reflect model changes (dev only)
  }),
    UserModule,
    PostModule,
  AuthModule,
  ChatModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}