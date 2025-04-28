import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('blog')
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {
  }
  @Post("/")
  createBlogDto(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.createBlog(createBlogDto);
  }

  @Get("/user-blogs")
  getUserBlogs() {
    return this.blogService.getUserBlogs();
  }

  @Get("/")
  @SkipAuth()
  getBlogs(@Query() PaginationDto: PaginationDto) {
    return this.blogService.getBlogs(PaginationDto);
  }
}