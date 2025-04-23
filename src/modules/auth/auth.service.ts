import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { AuthMessage, BadRequestMessage, PublicMessage } from 'src/common/enums/message.enum';
import { OtpEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthResponse } from './types/response';
import { REQUEST } from '@nestjs/core';

@Injectable({scope: Scope.REQUEST})
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    @Inject(REQUEST) private request: Request,
    private tokenService: TokenService
  ){}

  async userExistence(authDto: AuthDto, res: Response){
    const { method, type, username } = authDto
    let result: AuthResponse
    switch (type){
      case AuthType.Login:
        result = await this.login(method, username)
        return this.sendResponse(res, result)
      case AuthType.Register:
        result = await this.register(method, username)
        return this.sendResponse(res, result)
      default:
        throw new UnauthorizedException()
    }
  }

  async login(method: AuthMethod, username: string){
    this.usernameValidator(method, username)
    let user: UserEntity | null = await this.checkExistUser(method, username)
    if(!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount)
    const otp = await this.saveOtp(user.id)
    const token = this.tokenService.createOtpToken({userId: user.id})
    return {
      code: otp.code,
      token
    }
  }
  
  async register(method: AuthMethod, username: string){
    this.usernameValidator(method, username)
    if(method === AuthMethod.Username) {
      throw new BadRequestException(BadRequestMessage.InvalidRegisterData)
    }
    let user: UserEntity | null = await this.checkExistUser(method, username)
    if(user) throw new ConflictException(AuthMessage.AlreadyExistAccount)
    user = this.userRepository.create({[method]: username})
    user = await this.userRepository.save(user)
    user.username = `m_${user.id}`
    user = await this.userRepository.save(user)
    const otp = await this.saveOtp(user.id)
    const token = this.tokenService.createOtpToken({userId: user.id})
    return {
      token,
      code: otp.code
    }
  }

  async sendResponse(res: Response, result: AuthResponse) {
    const {token, code} = result
    res.cookie(CookieKeys.Otp, token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000*60*2)
    })
    res.json({
      message: PublicMessage.OtpSentSuccessfully,
      code
    })
  }

  usernameValidator(method: AuthMethod, username: string){
    switch (method){
      case AuthMethod.Email:
        if(isEmail(username)) return username
        throw new BadRequestException(BadRequestMessage.InvalidEmailFormat)
      case AuthMethod.Phone:
        if(isMobilePhone(username, "fa-IR")) return username
        throw new BadRequestException(BadRequestMessage.InvalidMobileFormat)
      case AuthMethod.Username:
        return username
      default:
        throw new BadRequestException(BadRequestMessage.InvalidUsernameFormat)
    }
  }

  async checkExistUser(method: AuthMethod, username: string){
    let user: UserEntity | null
    if(method === AuthMethod.Email) {
      user = await this.userRepository.findOneBy({email: username})
    } else if(method === AuthMethod.Phone) {
      user = await this.userRepository.findOneBy({phone: username})
    } else if(method === AuthMethod.Username) {
      user = await this.userRepository.findOneBy({username})
    } else {
      throw new BadRequestException(BadRequestMessage.InvalidLoginData)
    }
    return user
  }

  async checkOtp(checkOtpDto: CheckOtpDto) {
    const token = this.request.cookies?.[CookieKeys.Otp]
    if(!token) throw new UnauthorizedException(AuthMessage.ExpiredCode)
    const {userId} = this.tokenService.verifyOtpToken(token)
    const otp = await this.otpRepository.findOneBy({userId})
    if(!otp) throw new UnauthorizedException(AuthMessage.TryAgain)
    const now = new Date()
    if(otp.expires < now) throw new UnauthorizedException(AuthMessage.ExpiredCode)
    if(otp.code !== checkOtpDto.code) throw new UnauthorizedException(AuthMessage.LoginAgain)
    const accessToken = this.tokenService.createAccessToken({userId})
    return {
      token: accessToken,
      message: PublicMessage.LoginSuccessfully 
    }
  }

  async saveOtp(userId: number) {
    const code = randomInt(10000, 99999).toString()
    const expiresIn = new Date(new Date().getTime() + 1000*60*2)
    let otp = await this.otpRepository.findOneBy({userId})
    if(otp) {
      otp.code = code
      otp.expires = expiresIn
    } else {
      otp = this.otpRepository.create({code, expires: expiresIn, userId})
    }
    otp = await this.otpRepository.save(otp)
    await this.userRepository.update({id: userId}, {otpId: otp.id})
    // TODO: send otp to user via sms or email
    return otp
  }

  async validateAccessToken(token: string) {
    const { userId } = this.tokenService.verifyAccessToken(token)
    const user = await this.userRepository.findOneBy({id: userId})
    if(!user) throw new UnauthorizedException(AuthMessage.LoginAgain)
    return user
  }
  
}
