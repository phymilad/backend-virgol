import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { isDate } from 'class-validator';
import { Gender } from './enum/gender.enum';
import { ProfileImages } from './types/files';
import { removeSlashPublicFromPath } from 'src/common/utils/functions.util';
import { EmailDto } from './dto/email.dto';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';

@Injectable({scope: Scope.REQUEST})
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
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

    async changeEmail(emailDto: EmailDto) {
        const userFromRequest = this.request.user
        const user = await this.userRepository.findOneBy({email: emailDto.email})
        if (user && user?.id !== userFromRequest?.id) {
            return {
                statusCode: 400,
                message: "Email already exists",
                data: null 
            }
        } else if(user && user?.id === userFromRequest?.id) {
            return {
                message: "Email updated successfully", 
            }
        }
        if (user) {
            user.new_email = emailDto.email
            const otp = await this.authService.saveOtp(user.id)
            const token = await this.tokenService.createEmailToken({email: emailDto.email})
            return {
                code: otp.code,
                token
            }
        }
    }
}
