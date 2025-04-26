import { IsMobilePhone } from "class-validator";

export class ChangePhoneDto {
    @IsMobilePhone("fa-IR")
    phone: string
}