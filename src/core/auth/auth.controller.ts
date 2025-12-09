import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGenerateUser } from './input-models/auth-generate-user.im';
import { AuthGenerateUserDto } from './dto/auth-generate-user.dto';
import { AuthLoginInput } from './input-models/auth-login.im';
import { AuthLoginInputDto } from './dto/auth-login-input.dto';
import { LoginResult } from './view-models/login-result.vm';
import { ObjectTransformer } from '@common/helper/object-transformer.helper';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authServicea: AuthService) {}

  @Post()
  async generateUser(@Body() generateUser: AuthGenerateUser) {
    const generateUserDto = new AuthGenerateUserDto({
      name: generateUser.name,
      lastName: generateUser.lastName,
      email: generateUser.email,
      password: generateUser.password,
      nickName: generateUser.nickName,
    });

    return this.authServicea.generateUser(generateUserDto);
  }

  @Post('/login')
  async login(@Body() loginInput: AuthLoginInput): Promise<LoginResult> {
    const loginInputDto = new AuthLoginInputDto({
      email: loginInput.email,
      password: loginInput.password,
    });

    const loginResultDto = await this.authServicea.login(loginInputDto);

    return ObjectTransformer.transform(loginResultDto, LoginResult, {
      excludeExtraneousValues: true,
    });
  }
}
