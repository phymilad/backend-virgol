import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('blog')
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {
  }
  @Post("/")
  createBlogDto(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.createBlog(createBlogDto);
  }

  @Get("/")
  getUserBlogs() {
    return this.blogService.getUserBlogs();
  }
}