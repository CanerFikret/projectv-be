import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServerService } from './server.service';
import { Secure } from '@core/security/secure.decorator';
import { AuthContext } from '@core/auth/auth.context';
import { ServerGenerateInput } from './input-models/server-generate.im';
import { ObjectTransformer } from '@common/helper/object-transformer.helper';
import { ServerGenerateDto } from './dto/server-generate.dto';
import { SuccessResponse } from '@common/view-models/success-response.vm';
import { success } from '@common/helper/response';
import { Server } from './view-models/server.vm';
import { ServerQueryDto } from './dto/server-query.dto';
import { ServerQueryInput } from './input-models/server-query.im';
import { ServerRaw } from './view-models/server-raw.vm';
import { ServerRegisterInput } from './input-models/server-register.im';

@ApiTags('Servers')
@Controller('servers')
export class ServerController {
  constructor(
    private readonly serverService: ServerService,
    private readonly authContext: AuthContext,
  ) {}

  @Post('/query')
  @Secure()
  async getServerByIdentifier(
    @Body() input: ServerQueryInput,
  ): Promise<Server | null> {
    const userid = this.authContext.user.id;
    const serverQueryDto = ObjectTransformer.transform(input, ServerQueryDto);

    console.log(serverQueryDto);

    const serverDto = await this.serverService.getServer(serverQueryDto);
    const server = ObjectTransformer.transform(serverDto, Server, {
      excludeExtraneousValues: true,
    });
    return server;
  }

  @Post('/register')
  @Secure()
  async registerToServer(
    @Body() input: ServerRegisterInput,
  ): Promise<SuccessResponse> {
    const userid = this.authContext.user.id;
    await this.serverService.registerToServerMembership(userid, input.serverId);
    return success();
  }

  @Post()
  @Secure()
  async generateServer(
    @Body() generateInput: ServerGenerateInput,
  ): Promise<SuccessResponse> {
    const userid = this.authContext.user.id;
    const serverGenerateDto = ObjectTransformer.transform(
      generateInput,
      ServerGenerateDto,
    );
    await this.serverService.generateServer(userid, serverGenerateDto);
    return success();
  }

  @Get()
  @Secure()
  async getServers(): Promise<ServerRaw[]> {
    const userid = this.authContext.user.id;
    const servers = await this.serverService.getServersByUserId(userid);

    const list = servers.map((server) =>
      ObjectTransformer.transform(server, Server, {
        excludeExtraneousValues: true,
      }),
    );
    return list;
  }

  @Delete('/:serverId')
  @Secure()
  async leaveServer(
    @Param('serverId') serverId: string,
  ): Promise<SuccessResponse> {
    const userid = this.authContext.user.id;
    await this.serverService.leaveServer(userid, serverId);
    return success();
  }
}
