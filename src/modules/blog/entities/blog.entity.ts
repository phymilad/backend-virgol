import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { BlogStatus } from "../enums/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogLikeEntity } from "./blog-like.entity";
import { BlogBookmarkEntity } from "./blog-bookmark.entity";
import { BlogCommentEntity } from "./blog-comment.entity";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BlogCategoryEntity } from "./blog-category.entity";

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
    @Column()
    title: string;
    
    @Column()
    description: string;
    
    @Column()
    content: string;
    
    @Column({nullable: true})
    image: string;
    
    @Column({default: BlogStatus.DRAFT})
    status: BlogStatus;
    
    @Column({unique: true})
    slug: string;

    @Column()
    time_for_study: string;
    
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    // Relation with UserEntity
    @Column()
    authorId: number;
    @ManyToOne(() => UserEntity, (user) => user.blogs, {onDelete: 'CASCADE'})
    author: UserEntity

    // Relation with BlogLikeEntity
    @OneToMany(() => BlogLikeEntity, (like) => like.blog)
    likes: BlogLikeEntity[]

    // Relation with BlogBookmarkEntity
    @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.blog)
    bookmarks: BlogBookmarkEntity[]

    // Relation with BlogCommentEntity
    @OneToMany(() => BlogCommentEntity, (comment) => comment.blog)
    comments: BlogCommentEntity[]

    // Relation with BlogCategoryEntity
    @OneToMany(() => BlogCategoryEntity, (category) => category.blog)
    categories: BlogCategoryEntity[]

}
