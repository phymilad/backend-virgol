import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}
  @Post("user-existence")
  async userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
    return this.authService.userExistence(authDto, res)
    
  }
  @Post("check-otp")
  async checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.authService.checkOtp(checkOtpDto)
    
  }

  @Get("check-login")
  @UseGuards(AuthGuard)
  checkLogin(@Req() req: Request) {
    return req.user
  }
}
