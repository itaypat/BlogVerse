import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  Signin(@Body() data : SigninDto){
    return this.authService.signin(data);
  }

  @Post('/signup')
  Signup(@Body() data: SignupDto){
    return this.authService.signup(data);
  }
}
