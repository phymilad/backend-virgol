import { Body, Controller, Get, ParseFilePipe, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ProfileDto } from './dto/profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer'
import { multerDestination, multerFileName, multerStorage } from 'src/common/utils/multer.util';
import { ProfileImages } from './types/files';
import { UploadedOptionalFiles } from 'src/common/decorators/uploadfile.decorator';

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

}
