import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadType } from 'src/common/type/Payload';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        const jwtSecret = config.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }

        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    // Assumes your cookie is named 'accessToken'
                    const cookies = request.cookies as Record<string, string> | undefined;
                    return cookies?.accessToken ?? null;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtSecret
        });
    }

    validate(payload: PayloadType): PayloadType {
        const result = {
            uid: payload.sub,
            role: payload.role,
            mobile: payload.mobile
        };
        return result as PayloadType;
    }
}
