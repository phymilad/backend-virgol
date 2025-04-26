import { BadRequestException, ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';
import { isDate } from 'class-validator';
import { Gender } from './enum/gender.enum';
import { ProfileImages } from './types/files';
import { removeSlashPublicFromPath } from 'src/common/utils/functions.util';
import { ChangeEmailDto } from './dto/email.dto';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { cookieOptionsToken } from 'src/common/utils/cookie.util';
import { OtpEntity } from './entities/otp.entity';
import { AuthMessage, BadRequestMessage } from 'src/common/enums/message.enum';
import { AuthMethod } from '../auth/enums/method.enum';
import { ChangePhoneDto } from './dto/phone.dto';

@Injectable({scope: Scope.REQUEST})
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @Inject(REQUEST) private request: Request,
        private authService: AuthService,
        private tokenService: TokenService,
    ){}
    async changeProfile(files: ProfileImages, profileDto: ProfileDto) {
        
        const { image_profile, bg_image } = files
        let imageProfilePath: string | null = null
        let bgImageProfilePath: string | null = null

        if (image_profile && image_profile.length > 0) imageProfilePath = removeSlashPublicFromPath(image_profile[0].path)
        if (bg_image && bg_image.length > 0) bgImageProfilePath = removeSlashPublicFromPath(bg_image[0].path)
        
        const { bio, birthdate, gender, linkedin_profile, nick_name, x_profile } = profileDto
        const user = this.request.user
        console.log("user", user)
        
        let profile = await this.profileRepository.findOneBy({userId: user?.id})
        console.log("profile1: ", profile)
        if (profile) {
            if (bio) profile.bio = bio
            if (birthdate && isDate(birthdate)) profile.birthdate = birthdate
            if (gender && Object.values(Gender).includes(gender)) profile.gender = gender
            if (linkedin_profile) profile.linkedin_profile = linkedin_profile
            if (nick_name) profile.nick_name = nick_name
            if (x_profile) profile.x_profile = x_profile
            if (imageProfilePath) profile.image_profile = imageProfilePath
            if (bgImageProfilePath) profile.bg_image = bgImageProfilePath
        } 
        else profile = this.profileRepository.create({bio, birthdate, gender, linkedin_profile, nick_name, x_profile})
        
        if(!user?.profileId) await this.userRepository.update({id: user?.id}, {profileId: profile?.id})
            
        await this.profileRepository.save(profile)
        console.log("profile2: ", profile)
        
        return {
            statusCode: 200,
            message: "Profile updated successfully",
            data: profile 
        }
    }

    async profile() {
        const user = this.request.user
        const profile = await this.userRepository.findOne({where: {id: user?.id}, relations: {profile: true}})
        return {
            statusCode: 200,
            message: "Profile fetched successfully",
            data: profile 
        }
    }

    async changeEmail(res: Response, changeEmailDto: ChangeEmailDto) {
        const userFromRequest = this.request.user
        const user = await this.userRepository.findOneBy({email: changeEmailDto.email})
        if (user && userFromRequest?.id && user.id !== userFromRequest.id) {
            throw new ConflictException("Email already exists")
        } else if(user && userFromRequest?.id && user.id === userFromRequest.id) {
            return {
                message: "Email updated successfully", 
            }
        }
        if (!user && userFromRequest) {
            const otp = await this.authService.saveOtp(userFromRequest.id, AuthMethod.Email)
            const token = this.tokenService.createEmailToken({email: changeEmailDto.email})
            await this.userRepository.update({id: userFromRequest.id}, {new_email: changeEmailDto.email})
            res.cookie(CookieKeys.EmailOtp, token, cookieOptionsToken())
            return res.json({
                code: otp.code, 
                message: "Code to change email is sent"
            })
        }
        throw new BadRequestException("Something went wrong")
    }

    async verifyEmail(code: string) {
        const user = this.request.user
        const token = this.request.cookies?.[CookieKeys.EmailOtp]
        if(!token) throw new BadRequestException("Token not found")
        const {email} = this.tokenService.verifyEmailToken(token)
        if(user?.id) {
            if(email !== user.new_email) throw new BadRequestException("Something went wrong")
            const otp = await this.checkOtp(user.id, code)
            if(otp.method !== AuthMethod.Email) throw new BadRequestException("Something went wrong")
            await this.userRepository.update({id: user.id}, {email, new_email: null, verify_email: true})
            return {
                statusCode: 200,
                message: "Email verified successfully",
            }
        }
    }

    async changePhone(res: Response, changePhoneDto: ChangePhoneDto) {
        const userFromRequest = this.request.user
        const user = await this.userRepository.findOneBy({phone: changePhoneDto.phone})
        if (user && userFromRequest?.id && user.id !== userFromRequest.id) {
            throw new ConflictException("Phone already exists")
        } else if(user && userFromRequest?.id && user.id === userFromRequest.id) {
            return {
                message: "Phone updated successfully", 
            }
        }
        if (!user && userFromRequest) {
            const otp = await this.authService.saveOtp(userFromRequest.id, AuthMethod.Phone)
            const token = this.tokenService.createPhoneToken({phone: changePhoneDto.phone})
            await this.userRepository.update({id: userFromRequest.id}, {new_phone: changePhoneDto.phone})
            res.cookie(CookieKeys.PhoneOtp, token, cookieOptionsToken())
            return res.json({
                code: otp.code, 
                message: "Code to change phone is sent"
            })
        }
        throw new BadRequestException("Something went wrong")
    }

    async verifyPhone(code: string) {
        const user = this.request.user
        const token = this.request.cookies?.[CookieKeys.PhoneOtp]
        if(!token) throw new BadRequestException("Token not found")
        const {phone} = this.tokenService.verifyPhoneToken(token)
        if(user?.id) {
            if(phone !== user.new_phone) throw new BadRequestException("Something went wrong")
            const otp = await this.checkOtp(user.id, code)
            if(otp.method !== AuthMethod.Phone) throw new BadRequestException("Something went wrong")
            await this.userRepository.update({id: user.id}, {phone, new_phone: null, verify_phone: true})
            return {
                statusCode: 200,
                message: "Phone verified successfully",
            }
        }
    }

    async checkOtp(userId: number, code: string) {
        const otp = await this.otpRepository.findOneBy({userId})
        if(!otp) throw new BadRequestException("Otp code not found")
        const now = new Date()
        if(otp.expires < now) throw new BadRequestException(AuthMessage.ExpiredCode)
        if(otp.code !== code) throw new BadRequestException("try again")
        return otp
    }

    // async changePhone(changeEmailDto: ChangeEmailDto) {
    //     const userFromRequest = this.request.user
    //     const user = await this.userRepository.findOneBy({email: changeEmailDto.email})
    //     if (user && user?.id !== userFromRequest?.id) {
    //         return {
    //             statusCode: 400,
    //             message: "Email already exists",
    //             data: null 
    //         }
    //     } else if(user && user?.id === userFromRequest?.id) {
    //         return {
    //             message: "Email updated successfully", 
    //         }
    //     }
    //     if (user) {
    //         user.new_email = changeEmailDto.email
    //         const otp = await this.authService.saveOtp(user.id)
    //         const token = await this.tokenService.createEmailToken({email: changeEmailDto.email})
    //         return {
    //             code: otp.code,
    //             token
    //         }
    //     }
    // }
}
