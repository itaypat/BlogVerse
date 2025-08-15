import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from 'src/models/post.model';

@Injectable()
export class PostService {
  
  constructor(
    @InjectModel(Post)
    private readonly postModel : typeof Post,
  ){}

  async create(data: CreatePostDto , user: any) {
    const currentDate = new Date().toDateString();
    try {
      const post = await this.postModel.create({
        title: data.title,
        content: data.content,
        isPublished: data.isPublished,
        authorId : user.id,
        date : currentDate
      })
      return "Post added"

    } catch (error) {
      throw new BadRequestException("Post Not Added")
    }
  }

  async findAll() {
    return await this.postModel.findAll();
  }

  async findOne(id: number) {
    const post = await this.postModel.findByPk(id);
    if (!post) {
     throw new BadRequestException("Post Not Found")
    }
    return post
  }

  async findByAuthor(id: number) {
    const post = await this.postModel.findAll({where:{authorId : id}});
    if (!post) {
     throw new BadRequestException("Post Not Found")
    }
    return post
  }

  async update(id: number, update: UpdatePostDto, userId:number) {
    const post = await this.postModel.findByPk(id)
    if (post && post.authorId == userId) {
      try {
        await post.update({
          title: update.title,
          content: update.content,
          isPublished: update.isPublished,
        })

        return "Post Updated"

      } catch (error) {
        throw new BadRequestException("Not updated")
      }
    }
    throw new NotFoundException("Post Not Found")
  }

  async remove(id: number , userId:number) {
    const post = await this.postModel.findByPk(id)
    if (post && post.authorId == userId) {
      try {
        this.postModel.destroy({where:{postId : id}})
        return "Post deleted"
      } catch (error) {
        throw new BadRequestException("Not removed")
      }
    }else{
      throw new NotFoundException("Invalid Post")
    }
  }
}
