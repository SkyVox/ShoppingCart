import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/jwt-auth.module';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    UserModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
