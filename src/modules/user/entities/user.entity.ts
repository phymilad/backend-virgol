import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { AuthMethod } from "src/modules/auth/enums/method.enum";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { BlogLikeEntity } from "src/modules/blog/entities/like.entity";
import { BlogBookmarkEntity } from "src/modules/blog/entities/bookmark.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({unique: true, nullable: true, type: "varchar", length: 30})
    username: string
    
    @Column({unique: true, nullable: true})
    phone: string
    
    @Column({unique: true, nullable: true})
    email: string

    @Column({type: "varchar", nullable: true})
    new_email: string | null

    @Column({type: "varchar", nullable: true})
    new_phone: string | null
    
    @Column({nullable: true})
    verify_email: boolean
    
    @Column({nullable: true})
    verify_phone: boolean
    
    @Column({nullable: true})
    password: string
    
    @CreateDateColumn()
    created_at: Date
    
    @UpdateDateColumn()
    updated_at: Date

    // Relation with OtpEntity
    @Column({nullable: true})
    otpId: number
    @OneToOne(() => OtpEntity,otp => otp.user, {nullable: true})
    @JoinColumn()
    otp: OtpEntity

    // Relation with ProfileEntity
    @Column({nullable: true})
    profileId: number
    @OneToOne(() => ProfileEntity, (profile) => profile.user, {nullable: true})
    profile: ProfileEntity

    // Relation with Blog
    @OneToMany(() => BlogEntity, (blog) => blog.author)
    @JoinColumn()
    blogs: BlogEntity[]

    // Relation with BlogLikeEntity
    @OneToMany(() => BlogLikeEntity, (like) => like.user)
    blog_likes: BlogLikeEntity[]

    // Relation with BlogBookmarkEntity
    @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.user)
    blog_bookmarks: BlogBookmarkEntity[]
}
