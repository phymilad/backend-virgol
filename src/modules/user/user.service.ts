import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({scope: Scope.REQUEST})
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @Inject(REQUEST) private request: Request
    ){}
    async changeProfile(profileDto: ProfileDto) {
        const user = this.request.user
        console.log("id: ", user?.id)
    }
}
