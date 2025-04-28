import { Body, Controller, Get, Patch, Post, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ProfileDto } from './dto/profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage } from 'src/common/utils/multer.util';
import { ProfileImages } from './types/files';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';
import { ChangeEmailDto } from './dto/email.dto';
import { Response } from 'express';
import { CheckOtpDto } from '../auth/dto/auth.dto';
import { ChangePhoneDto } from './dto/phone.dto';
import { ChangeUsernameDto } from './dto/username.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put("/profile")
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'image_profile', maxCount: 1 },
            { name: 'bg_image', maxCount: 1 },
        ],
        {
            storage: multerStorage("user-profile")
        }
    ))
    changeProfile(
        // @UploadedFiles() files: ProfileImages,
        @UploadedOptionalFiles() files: ProfileImages,
        @Body() profileDto: ProfileDto
    ) {
        return this.userService.changeProfile(files, profileDto);
    }

    @Get("profile")
    profile() {
        return this.userService.profile()
    }

    @Patch("change-email")
    changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
        return this.userService.changeEmail(res, emailDto)
    }

    @Post("verify-email-otp")
    verifyEmailOtp(@Body() otpDto: CheckOtpDto) {
        return this.userService.verifyEmail(otpDto.code)
    }

    @Patch("change-phone")
    changePhone(@Body() emailDto: ChangePhoneDto, @Res() res: Response) {
        return this.userService.changePhone(res, emailDto)
    }

    @Post("verify-phone-otp")
    verifyPhoneOtp(@Body() otpDto: CheckOtpDto) {
        return this.userService.verifyPhone(otpDto.code)
    }

    @Patch("change-username")
    changeUsername(@Body() usernameDto: ChangeUsernameDto, @Res() res: Response) {
        return this.userService.changeUsername(usernameDto)
    }

    // @Patch("change-phone")  
    // changePhone(emailDto: ChangePhoneDto) {
    //     return this.userService.changePhone(emailDto)
        
    // }

}
