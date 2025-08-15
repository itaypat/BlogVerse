import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private jwtservice : JwtService){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException("Token not found")
    }

    try {
      const payload = this.jwtservice.verify(token)
      console.log(payload)
      request.user = payload
      return true
    } catch (error) {
      throw new UnauthorizedException("Invalid Token")
    }
  }
}
