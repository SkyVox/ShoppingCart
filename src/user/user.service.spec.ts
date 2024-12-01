import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenRequestResponseDto } from './dto/token-request.dto';
import { UserRole } from './enums/user-role.enum';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const mock_uuid = '34f4e303-d6b5-4264-905e-d8b0d98a4bd4';
const mock_jwt_token = 'ey.1';

const token_request_dto = {
  Name: 'Tom',
  Role: UserRole.COMMON,
};

jest.mock('uuid', () => ({ v4: () => mock_uuid }));

describe('User Service', () => {
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: process.env.JWT_SECRET_TOKEN,
        }),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userService = app.get<UserService>(UserService);
    jwtService = app.get<JwtService>(JwtService);
  });

  describe('generateUserToken', () => {
    it(`should be defined`, () => {
      expect(userService.generateUserToken).toBeDefined();
    });

    it(`should call jwtService#signAsync with the correct payload`, async () => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mock_jwt_token);

      await userService.generateUserToken(token_request_dto);

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        Id: mock_uuid,
        ...token_request_dto,
      });
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
    });

    it('should generates a jwt token', async () => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mock_jwt_token);

      const responseDto = {
        Token: mock_jwt_token,
        Name: token_request_dto.Name,
      };

      const response: TokenRequestResponseDto =
        await userService.generateUserToken(token_request_dto);

      expect(response).toEqual(responseDto);
    });

    it('should throw an error if jwtService.signAsync throws an error', async () => {});
  });
});
