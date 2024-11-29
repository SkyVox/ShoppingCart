import { Module } from '@nestjs/common';
import { CartRepository } from '../infra/mock/repositories/cart.repository';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ICartRepository } from './interfaces/cart.repository.interface';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: ICartRepository,
      useClass: CartRepository,
    },
  ],
})
export class CartModule {}
