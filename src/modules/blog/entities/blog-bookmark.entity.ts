import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityNames.BlogBookmark)
export class BlogBookmarkEntity extends BaseEntity {
    // Relation with BlogEntity
    @Column()
    blogId: number;
    @ManyToOne(() => BlogEntity, (blog) => blog.bookmarks, {onDelete: 'CASCADE'})
    blog: BlogEntity

    // Relation with UserEntity
    @Column()
    userId: number;
    @ManyToOne(() => UserEntity, (user) => user.blog_bookmarks, {onDelete: 'CASCADE'})
    user: UserEntity

}