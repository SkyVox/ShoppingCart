import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  TokenRequestDto,
  TokenRequestResponseDto,
} from './dto/token-request.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('token')
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenRequestResponseDto })
  async generateUserToken(
    @Body() dto: TokenRequestDto,
  ): Promise<TokenRequestResponseDto> {
    return this.userService.generateUserToken(dto);
  }
}
