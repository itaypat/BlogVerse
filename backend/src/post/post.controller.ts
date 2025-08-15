import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/add')
  create(@Body() data: CreatePostDto, @Request() req) {
    return this.postService.create(data , req.user);
  }

  @Get('/')
  findAll() {
    return this.postService.findAll();
  }

  @Get('/myposts')
  myPosts(@Req() req) {
    const id = req.user.id
    return this.postService.findByAuthor(+id);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get('/author/:id')
  findByAuthor(@Param('id') id: string) {
    return this.postService.findByAuthor(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto , @Request() req) {
    return this.postService.update(+id, updatePostDto , req.user.id);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string , @Request() req) {
    return this.postService.remove(+id , req.user.id);
  }
}
