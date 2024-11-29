import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import {
  TokenRequestDto,
  TokenRequestResponseDto,
} from './dto/token-request.dto';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}

  public async generateUserToken(
    dto: TokenRequestDto,
  ): Promise<TokenRequestResponseDto> {
    const accessToken = await this.jwtService.signAsync({
      Id: uuidv4(),
      ...dto,
    });
    const responseData: TokenRequestResponseDto = {
      Token: accessToken,
      Name: dto.Name,
    };

    return responseData;
  }
}
