import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User)
    private readonly userModel : typeof User,
  ){}

  findAll() {
    return this.userModel.findAll({
    attributes: { exclude: ['password'] },
  });
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id , {
    attributes: { exclude: ['password'] },
  })
    if (!user) {
      throw new BadRequestException("No user found")
    }
    return user;
  }

  async remove(id: number) {
    const user = await this.userModel.destroy({where: {userId:id}})
    if (user == 1) {
      return `removed a #${id} user`;
    }
    return "Not removed";
  }
}
