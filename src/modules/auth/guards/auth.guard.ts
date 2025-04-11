import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { AuthMessage } from "src/common/enums/message.enum";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService
    ) {}
    async canActivate(context: ExecutionContext) {
        const httpContext = context.switchToHttp()
        const request: Request = httpContext.getRequest<Request>()
        const token = this.extractToken(request)
        request.user = await this.authService.validateAccessToken(token)
        console.log("request: ", request)
        return true
    }
    protected extractToken(request: Request) {
        const { authorization } = request.headers
        if(!authorization || authorization?.trim() === "") throw new UnauthorizedException(AuthMessage.LoginIsRequired)
        const [bearer, token] = authorization.split(" ")
        if(!bearer || !token || bearer?.toLowerCase() !== "bearer" || !isJWT(token)) throw new UnauthorizedException(AuthMessage.LoginIsRequired)
            return token
    }
}