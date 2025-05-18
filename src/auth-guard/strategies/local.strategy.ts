import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'mobile',
            passwordField: 'code'
        });
    }
    async validate(mobile: string, code: string) {
        const user = await this.authService.validateOtp({
            mobile: mobile,
            code: code
        });

        return user;
    }
}
