import { UserWithoutPasswordDto } from '@core/user/dto/user.dto';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AuthContext {
  private readonly clsNamespace = 'auth';
  private readonly keys = {
    user: `${this.clsNamespace}.systemUser`,
    permissionCodes: `${this.clsNamespace}.permissionCodes`,
  };

  constructor(private readonly cls: ClsService) {}

  set user(systemUser: UserWithoutPasswordDto) {
    this.cls.set(this.keys.user, systemUser);
  }

  get user(): UserWithoutPasswordDto {
    return this.cls.get(this.keys.user);
  }

  set permissionCodes(permissionCodes: string[]) {
    this.cls.set(this.keys.permissionCodes, permissionCodes);
  }

  get permissionCodes(): string[] {
    return this.cls.get(this.keys.permissionCodes);
  }
}
