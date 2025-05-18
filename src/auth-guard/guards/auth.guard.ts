// jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
// import { TokenBlacklistService } from './token-blacklist.service';

import { ConfigService } from '@nestjs/config';
import { PayloadType } from 'src/common/type/Payload';
import { RequestType } from 'src/common/type/Request';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        // private readonly tokenBlacklistService: TokenBlacklistService,
        private readonly config: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        // Check blacklist first
        // if (await this.tokenBlacklistService.isTokenBlacklisted(token)) {
        //     throw new UnauthorizedException('Token revoked');
        // }

        try {
            const payload: PayloadType = await this.jwtService.verifyAsync(token, {
                secret: this.config.get<string>('JWT_SECRET')
            });
            request.user = {
                uid: payload.sub,
                role: payload.role,
                mobile: payload.mobile
            } as RequestType;
        } catch {
            throw new UnauthorizedException('Invalid Token');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
