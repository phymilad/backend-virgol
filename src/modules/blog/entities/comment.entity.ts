import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity(EntityNames.BlogComment)
export class BlogCommentEntity extends BaseEntity {

    @Column()
    text: string

    @Column({default: false})
    accepted: boolean

    @CreateDateColumn()
    created_at: Date

    // Relation with BlogEntity
    @Column()
    blogId: number;
    @ManyToOne(() => BlogEntity, (blog) => blog.comments, {onDelete: 'CASCADE'})
    blog: BlogEntity

    // Relation with UserEntity
    @Column()
    userId: number;
    @ManyToOne(() => UserEntity, (user) => user.blog_comments, {onDelete: 'CASCADE'})
    user: UserEntity

    // Relation with comment itself
    @Column({nullable: true})
    parentId: number | null

    @OneToMany(() => BlogCommentEntity, comment => comment.parent)
    @JoinColumn({name: "parent"})
    children: BlogCommentEntity[]

    @ManyToOne(() => BlogCommentEntity, comment => comment.children, {onDelete: "CASCADE"})
    parent: BlogCommentEntity

}