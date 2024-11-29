import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-auth.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_TOKEN,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy],
  controllers: [],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
