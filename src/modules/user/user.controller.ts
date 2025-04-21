import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ProfileDto } from './dto/profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
@ApiTags("User")
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Put("/profile")
    changeProfile(@Body() profileDto: ProfileDto) {
        return this.userService.changeProfile(profileDto)
    }
}
