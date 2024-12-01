import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CartRepository } from '../infra/mock/repositories/cart.repository';
import { UserRole } from '../user/enums/user-role.enum';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { DeleteProductDto } from './dto/delete-product.dto';
import { InsertProductDto } from './dto/insert-product.dto';
import { Products } from './enum/product.enum';
import { ICartRepository } from './interfaces/cart.repository.interface';

const mock_uuid = '34f4e303-d6b5-4264-905e-d8b0d98a4bd4';

const common_user = {
  Id: '1',
  Name: 'Tom',
  Role: UserRole.COMMON,
};

const vip_user = {
  Id: '1',
  Name: 'Tom',
  Role: UserRole.VIP,
};

jest.mock('uuid', () => ({ v4: () => mock_uuid }));

describe('Cart Service', () => {
  let cartService: CartService;

  /**
   * Since we are using a local repository, we don't need to mock the repository.
   * But we could use `MongoTestModule` to test the service with a real database.
   */

  beforeAll(async () => {
    jest.mock('uuid', () => ({ v4: () => mock_uuid }));
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CartController],
      providers: [
        CartService,
        {
          provide: ICartRepository,
          useClass: CartRepository,
        },
      ],
    }).compile();

    cartService = app.get<CartService>(CartService);
  });

  describe('insertProduct', () => {
    it(`should throw an error if any problem occur on insert product function`, async () => {
      // Mocking the repository response.
      cartService.cartRepository.insert = jest.fn().mockResolvedValue(null);

      try {
        const dto: InsertProductDto = {
          ProductId: 'T_SHIRT',
          Name: 'Blue T-Shirt',
        };

        await cartService.insertProduct(common_user, dto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getStatus()).toEqual(400);
        expect(error.getResponse()).toEqual({
          message: 'An error has occurred while trying to insert the product.',
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    });

    it(`should successfully insert a product into user's cart`, async () => {
      const dto: InsertProductDto = {
        ProductId: 'T_SHIRT',
        Name: 'Blue T-Shirt',
      };

      const message = await cartService.insertProduct(common_user, dto);
      expect(message).toBe(mock_uuid);
    });

    it(`should add 3 different products into user's cart`, async () => {
      const insertProduct = jest.spyOn(cartService, 'insertProduct');

      // Adding first product: `t-shirt`.
      const firstProductDto: InsertProductDto = {
        ProductId: 'T_SHIRT',
        Name: 'Blue T-Shirt',
      };
      const firstProductMessage = await cartService.insertProduct(
        common_user,
        firstProductDto,
      );
      expect(firstProductMessage).toBe(mock_uuid);

      // Adding second product: `jeans`.
      const secondProductDto: InsertProductDto = {
        ProductId: 'JEANS',
        Name: 'Blue Jeans',
      };
      const secondProductMessage = await cartService.insertProduct(
        common_user,
        secondProductDto,
      );
      expect(secondProductMessage).toBe(mock_uuid);

      // Adding third product: `dress`.
      const thirdProduct: InsertProductDto = {
        ProductId: 'DRESS',
        Name: 'White Dress',
      };
      const thirdProductMessage = await cartService.insertProduct(
        common_user,
        thirdProduct,
      );
      expect(thirdProductMessage).toBe(mock_uuid);

      const cart = await cartService.findUserProducts(common_user);
      const products = cart.products;
      const uniqueProducts = new Set(products.map((product) => product.id));

      expect(products.length).toBe(3);
      expect(uniqueProducts.size).toBe(3);
      expect(insertProduct).toHaveBeenCalledTimes(3);
    });
  });

  describe('deleteProduct', () => {
    it(`should throw an error if user's cart is empty`, async () => {
      try {
        const dto: DeleteProductDto = {
          ProductId: 'T_SHIRT',
        };

        await cartService.deleteProduct(common_user, dto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getStatus()).toEqual(400);
        expect(error.getResponse()).toEqual({
          message: 'Cart not found! Try add some products.',
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    });

    it(`should throw an error if the given productId does not exist in user's cart`, async () => {
      try {
        const dto: DeleteProductDto = {
          ProductId: 'T_SHIRT',
        };

        await cartService.insertProduct(common_user, {
          ProductId: 'DRESS',
          Name: 'White Dress',
        });

        await cartService.deleteProduct(common_user, dto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getStatus()).toEqual(400);
        expect(error.getResponse()).toEqual({
          message: 'No product were found to be removed from the cart.',
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    });

    it(`should successfully remove the product from user's cart`, async () => {
      const dto: DeleteProductDto = {
        ProductId: 'T_SHIRT',
      };

      await cartService.insertProduct(common_user, {
        ProductId: 'T_SHIRT',
        Name: 'Blue T-Shirt',
      });

      const message = await cartService.deleteProduct(common_user, dto);
      expect(message).toBe('1x T_SHIRT removed successfully.');
    });
  });

  describe('calculatePrice', () => {
    it(`should return 0 if user is either COMMON or VIP and their card is empty`, async () => {
      await cartService.insertProduct(common_user, {
        ProductId: 'T_SHIRT',
        Name: 'Blue T-Shirt',
      });
      await cartService.deleteProduct(common_user, {
        ProductId: 'T_SHIRT',
      });

      await cartService.insertProduct(vip_user, {
        ProductId: 'T_SHIRT',
        Name: 'Blue T-Shirt',
      });
      await cartService.deleteProduct(vip_user, {
        ProductId: 'T_SHIRT',
      });

      const commonCartPrice = await cartService.calculatePrice(common_user);
      const vipCartPrice = await cartService.calculatePrice(vip_user);

      expect(commonCartPrice.cartTotalPrice).toBe(0);
      expect(commonCartPrice.finalPrice).toBe(0);
      expect(vipCartPrice.cartTotalPrice).toBe(0);
      expect(vipCartPrice.finalPrice).toBe(0);
    });

    it(`should add 15% of discount if user is VIP and there are only 2 products on user's cart`, async () => {
      await cartService.insertProduct(vip_user, {
        ProductId: 'T_SHIRT',
        Name: 'Blue T-Shirt',
      });

      await cartService.insertProduct(vip_user, {
        ProductId: 'DRESS',
        Name: 'White Dress',
      });

      const cartPrice = await cartService.calculatePrice(vip_user);
      expect(cartPrice.finalPrice).toBe(99.23);
    });

    it(`should use the VIP 15% of discount if there are 4 T-Shirt, 1 Jeans and 1 Dress on user's cart`, async () => {
      for (let i = 0; i < 4; i++) {
        await cartService.insertProduct(vip_user, {
          ProductId: 'T_SHIRT',
          Name: 'Blue T-Shirt',
        });
      }

      await cartService.insertProduct(vip_user, {
        ProductId: 'JEANS',
        Name: 'Blue Jeans',
      });

      await cartService.insertProduct(vip_user, {
        ProductId: 'DRESS',
        Name: 'White Dress',
      });

      const cartPrice = await cartService.calculatePrice(vip_user);
      expect(cartPrice.finalPrice).not.toBe(254.22); // Should not use the `Get 3 for the price of 2` promotion.
      expect(cartPrice.finalPrice).toBe(246.68);
    });

    it(`should return the sum of the products if user is COMMON and there are only 2 products on user's cart`, async () => {
      await cartService.insertProduct(common_user, {
        ProductId: 'T_SHIRT',
        Name: 'Blue T-Shirt',
      });

      await cartService.insertProduct(common_user, {
        ProductId: 'DRESS',
        Name: 'White Dress',
      });

      const sum = Number((Products.T_SHIRT + Products.DRESS).toFixed(2));

      const cartPrice = await cartService.calculatePrice(common_user);
      expect(cartPrice.cartTotalPrice).toBe(sum);
      expect(cartPrice.finalPrice).toBe(sum);
    });

    it(`should throw an error if user's cart has not been created yet`, async () => {
      try {
        await cartService.calculatePrice(common_user);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getStatus()).toEqual(400);
        expect(error.getResponse()).toEqual({
          message: 'Cart not found! Try add some products.',
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    });

    /**
     * Adding the challenge tests scenarios.
     */

    it(`should return 71.98 if user is COMMON and 3 t-shirts is added to the cart`, async () => {
      for (let i = 0; i < 3; i++) {
        await cartService.insertProduct(common_user, {
          ProductId: 'T_SHIRT',
          Name: 'Blue T-Shirt',
        });
      }

      const cartPrice = await cartService.calculatePrice(common_user);
      expect(cartPrice.finalPrice).toBe(71.98);
    });

    it(`should return 166.99 if user is COMMON and 2 t-shirts and 2 jeans is added to the cart`, async () => {
      for (let i = 0; i < 2; i++) {
        await cartService.insertProduct(common_user, {
          ProductId: 'T_SHIRT',
          Name: 'Blue T-Shirt',
        });
      }

      for (let i = 0; i < 2; i++) {
        await cartService.insertProduct(common_user, {
          ProductId: 'JEANS',
          Name: 'Blue Jeans',
        });
      }

      const cartPrice = await cartService.calculatePrice(common_user);
      expect(cartPrice.finalPrice).toBe(166.99);
    });

    it(`should return 161.50 if user is VIP and 3 dresses is added to the cart`, async () => {
      for (let i = 0; i < 3; i++) {
        await cartService.insertProduct(vip_user, {
          ProductId: 'DRESS',
          Name: 'White Dress',
        });
      }

      const cartPrice = await cartService.calculatePrice(vip_user);
      expect(cartPrice.finalPrice).toBe(161.5);
    });

    it(`should return 227 if user is VIP and 2 dresses and 2 jeans is added to the cart`, async () => {
      for (let i = 0; i < 2; i++) {
        await cartService.insertProduct(vip_user, {
          ProductId: 'JEANS',
          Name: 'Blue Jeans',
        });
      }

      for (let i = 0; i < 2; i++) {
        await cartService.insertProduct(vip_user, {
          ProductId: 'DRESS',
          Name: 'White Dress',
        });
      }

      const cartPrice = await cartService.calculatePrice(common_user);
      expect(cartPrice.finalPrice).toBe(227);
    });

    it(`should return 173.47 if user is VIP and 4 t-shirts and 1 jeans is added to the cart`, async () => {
      for (let i = 0; i < 4; i++) {
        await cartService.insertProduct(vip_user, {
          ProductId: 'T_SHIRT',
          Name: 'Blue T-Shirt',
        });
      }

      await cartService.insertProduct(vip_user, {
        ProductId: 'JEANS',
        Name: 'Blue Jeans',
      });

      const cartPrice = await cartService.calculatePrice(common_user);
      expect(cartPrice.finalPrice).toBe(173.47);
    });
  });
});
