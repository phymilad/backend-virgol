import { BadRequestException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { createSlug, randomId } from 'src/common/utils/functions.util';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BlogStatus } from './enums/status.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';

@Injectable({scope: Scope.REQUEST})
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @Inject(REQUEST) private request: Request,
    ) {}
    async createBlog(createBlogDto: CreateBlogDto) {
        const user = this.request.user;
        if(!user) {
            throw new UnauthorizedException("Login again");
        }
        let { title, slug, content, description, image, time_for_study } = createBlogDto;
        slug = createSlug(!!slug ? slug : title)

        const doesExist = await this.findBlogBySlug(slug)

        const blog = this.blogRepository.create({
            title,
            slug: doesExist ? `${slug}-${randomId()}` : slug,
            content,
            description,
            image,
            status: BlogStatus.DRAFT,
            time_for_study,
            authorId: user.id
        });
        await this.blogRepository.save(blog);
        return {
            message: "Blog created successfully",
        }
    }

    async findBlogBySlug(slug: string) {
        const blog = await this.blogRepository.findOne({where: {slug}})
        return !!blog
    }

    async getBlogs(paginationDto: PaginationDto) {
        const { page, limit, skip } = paginationSolver(paginationDto);
        const [blogs, count] = await this.blogRepository.findAndCount({where: {}, order: {created_at: "DESC"}, skip, take: limit})
        return {
            pagination: paginationGenerator(count, page, limit),
            blogs
        }
    }

    async getUserBlogs() {
        const user = this.request.user;
        if(!user) {
            throw new UnauthorizedException("Login again");
        }
        const blogs = await this.blogRepository.find({where: {authorId: user.id}, order: {created_at: "DESC"}})
        return blogs
    }

}
