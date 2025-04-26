import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { AuthMethod } from "src/modules/auth/enums/method.enum";

@Entity(EntityNames.Otp)
export class OtpEntity extends BaseEntity {
    @Column()
    code: string
    
    @Column()
    expires: Date
    
    @Column()
    userId: number
    
    @Column({nullable: true})
    method: AuthMethod

    @OneToOne(() => UserEntity,user => user.otp, {onDelete: "CASCADE"})
    user: UserEntity
}