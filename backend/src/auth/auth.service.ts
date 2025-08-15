import { BadRequestException, Injectable } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User)
        private readonly userModel : typeof User,
        private jwtService : JwtService,
    ){}

    async signin(data: SigninDto){
        let user = await this.userModel.findOne({where: {email: data.email}})
        
        if (user && user.password == data.password) {
            const payload = {id : user.userId , name: user.name , email: user.email}
            return {
                token: await this.jwtService.signAsync(payload)
            }
        }
        else{
            throw new BadRequestException("Invalid User") 
        }
    }
    
    async signup(data: SignupDto){
        const emailExist = await this.userModel.findOne({where:{email : data.email}})
        if (emailExist) {
            throw new BadRequestException("Email Already Exists")
        }

        const user= await this.userModel.create({
            name : data.name,
            email: data.email,
            password: data.password
        })

        const payload = {id: user.userId , name: user.name , email: user.email}
        return {
            token: await this.jwtService.signAsync(payload)
        }
    }
}
