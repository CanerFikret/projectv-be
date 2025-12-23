import { LoggerService } from '@common/global-services/logger/logger.service';
import {
  InjectPrisma,
  PrismaTransactionHost,
} from '@common/global-services/prisma/prisma-provider';
import { Injectable } from '@nestjs/common';
import { ServerGenerateDto } from './dto/server-generate.dto';
import { ServiceException } from '@common/exceptions/service.exception';
import { ErrorType } from '@common/exceptions/error-type.enum';
import { ServerCode } from '@common/helper/generate-server-code.helper';
import { ServerDto } from './dto/server.dto';
import { UserService } from '@core/user/user.service';
import { ServerQueryDto } from './dto/server-query.dto';
import { UserWithoutPasswordDto } from '@core/user/dto/user.dto';

@Injectable()
export class ServerService {
  constructor(
    @InjectPrisma() private readonly txHost: PrismaTransactionHost,
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {}

  async generateServer(
    userId: string,
    serverGenerateDto: ServerGenerateDto,
  ): Promise<void> {
    const code = await this.generateServerCode();

    const server = await this.txHost.tx.server
      .create({
        data: {
          name: serverGenerateDto.name,
          code: code,
          description: serverGenerateDto.description,
          generatedByUserId: userId,
        },
      })
      .catch((err) => {
        this.logger.error({
          message: 'Error generating server',
          error: err,
        });
        throw new ServiceException(ErrorType.GenerateError);
      });
    await this.registerToServerMembership(userId, server.id);
  }

  async registerToServerMembership(
    userId: string,
    serverId: string,
  ): Promise<void> {
    await this.txHost.tx.userServerMembership
      .upsert({
        where: {
          userId_serverId: {
            userId: userId,
            serverId: serverId,
          },
        },
        create: {
          userId: userId,
          serverId: serverId,
        },
        update: {
          deletedAt: null,
        },
      })
      .catch((err) => {
        this.logger.error({
          message: 'Error registering to server membership',
          error: err,
        });
        throw new ServiceException(ErrorType.GenerateError);
      });
  }

  async getServer(findDto: ServerQueryDto): Promise<ServerDto | null> {
    const server = await this.txHost.tx.server
      .findFirst({
        where: {
          OR: [{ id: findDto.identifier }, { code: findDto.identifier }],
        },
      })
      .catch(() => {
        throw new ServiceException(ErrorType.GeneralError);
      });

    if (!server) {
      return null;
    }

    const serverDto = new ServerDto({
      id: server.id,
      code: server.code,
      name: server.name,
      description: server.description,
      generatedAt: server.generatedAt,
    });

    if (findDto.include?.members) {
      serverDto.members = await this.getUsersByServerId(server.id);
    }

    if (findDto.include?.generatedBy) {
      console.log(findDto.include?.generatedBy);
      const generatedByUser = await this.userService.getByIdOrThrow(
        server.generatedByUserId,
      );
      serverDto.generatedBy = generatedByUser;
    }

    /**
     * @todo: implement channels inclusion
     */
    if (findDto.include?.channels) {
    }

    return serverDto;
  }

  private async getUsersByServerId(
    serverId: string,
  ): Promise<UserWithoutPasswordDto[]> {
    const memberships = await this.txHost.tx.userServerMembership
      .findMany({
        where: { serverId: serverId, deletedAt: null },
        include: {
          user: {
            omit: { password: true, passwordSalt: true },
          },
        },
      })
      .catch((err) => {
        this.logger.error({
          message: 'Error fetching server memberships',
          error: err,
        });
        throw new ServiceException(ErrorType.GeneralError);
      });

    const usersDto = memberships.map(
      (membership) =>
        new UserWithoutPasswordDto({
          id: membership.user.id,
          email: membership.user.email,
          nickName: membership.user.nickName,
          name: membership.user.name,
          lastName: membership.user.lastName,
        }),
    );
    return usersDto;
  }

  async getServersByUserId(userId: string): Promise<ServerDto[]> {
    const servers = await this.txHost.tx.userServerMembership
      .findMany({
        where: { userId: userId, deletedAt: null },
        include: { server: true },
      })
      .catch((err) => {
        this.logger.error({
          message: 'Error fetching user servers',
          error: err,
        });
        throw new ServiceException(ErrorType.GeneralError);
      });

    const list = servers.map((membership) => {
      return new ServerDto({
        id: membership.server.id,
        code: membership.server.code,
        name: membership.server.name,
        description: membership.server.description,
      });
    });

    return list;
  }

  private async generateServerCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = ServerCode.generateServerCode();
      const searchBy = new ServerQueryDto({ identifier: code });
      const existing = await this.getServer(searchBy);

      if (!existing) {
        return code;
      }
    }
    throw new ServiceException(
      ErrorType.GenerateError,
      'Failed to generate unique server code after multiple attempts.',
    );
  }

  async leaveServer(userId: string, serverId: string): Promise<void> {
    await this.txHost.tx.userServerMembership
      .update({
        where: {
          userId_serverId: {
            userId: userId,
            serverId: serverId,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      })
      .catch((err) => {
        this.logger.error({
          message: 'Error leaving server',
          error: err,
        });
        throw new ServiceException(ErrorType.GeneralError);
      });
  }
}
