import { ErrorType } from '@common/exceptions/error-type.enum';
import { ServiceException } from '@common/exceptions/service.exception';
import { LoggerService } from '@common/global-services/logger/logger.service';
import {
  InjectPrisma,
  PrismaTransactionHost,
} from '@common/global-services/prisma/prisma-provider';
import { Injectable } from '@nestjs/common';
import { UserDto, userWithoutPassword } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectPrisma() private readonly txHost: PrismaTransactionHost,
    private readonly loggerService: LoggerService,
  ) {}

  async findUserByEmail(email: string): Promise<UserDto> {
    const user = await this.txHost.tx.user
      .findUnique({
        where: {
          email: email,
        },
      })
      .catch((err) => {
        this.loggerService.error(
          {
            message: 'Error accuring while finding user by email',
            error: err,
          },
          UserService.name,
        );
        throw new ServiceException(ErrorType.GeneralError);
      });

    if (!user) {
      throw new ServiceException(ErrorType.NotFound);
    }

    const userDto = new UserDto({
      id: user.id,
      email: user.email,
      password: user.password,
      passwordSalt: user.passwordSalt,
      nickName: user.nickName,
      name: user.name,
      lastName: user.lastName,
    });

    return userDto;
  }

  async getByIdOrThrow(userId: string): Promise<userWithoutPassword> {
    const user = await this.txHost.tx.user
      .findUnique({
        where: { id: userId },
      })
      .catch((err) => {
        this.loggerService.error(
          {
            message: 'Error accuring while getting user by id',
            error: err,
          },
          UserService.name,
        );
        throw new ServiceException(ErrorType.GeneralError);
      });
    if (!user) {
      throw new ServiceException(ErrorType.NotFound);
    }
    return new userWithoutPassword({
      id: user.id,
      email: user.email,
      nickName: user.nickName,
      name: user.name,
      lastName: user.lastName,
    });
  }
}
