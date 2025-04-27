import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { BlogStatus } from "../enums/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogLikeEntity } from "./like.entity";

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
    
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    // Relation with UserEntity
    @Column()
    authorId: number;
    @ManyToOne(() => UserEntity, (user) => user.blogs, {onDelete: 'CASCADE'})
    author: UserEntity
    
    // Relation with LikeEntity
    @OneToMany(() => BlogLikeEntity, (like) => like.blog)
    likes: BlogLikeEntity[]

}
