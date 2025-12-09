import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordStoreDto } from './dto/password-store.dto';
import { PasswordCompareDto } from './dto/password-compare.dto';
import { passwordRule } from './password.rule';
import { ValidationException } from '@common/exceptions/validation.exception';

@Injectable()
export class PasswordService {
  async prepareToStore(password: string): Promise<PasswordStoreDto> {
    if (!this.validatePasswordRequirements(password)) {
      throw new ValidationException('INVALID_PASSWORD', 'Invalid Password');
    }

    const salt = await this.generateSalt();
    const saltedPassword = password + salt;
    const hashedSaltedPassword = await bcrypt.hash(saltedPassword, 3);

    return new PasswordStoreDto({
      hashedSaltedPassword: hashedSaltedPassword,
      passwordSalt: salt,
    });
  }

  validatePasswordRequirements(password: string): boolean {
    const minLength = 6;
    const maxLength = 30;
    if (
      typeof password !== 'string' ||
      password.length < minLength ||
      password.length > maxLength
    ) {
      return false;
    }

    if (!passwordRule.test(password)) {
      return false;
    }
    return true;
  }

  async generateSalt(): Promise<string> {
    return await bcrypt.genSalt(7);
  }

  async compareWithStored(
    passwordCompareDto: PasswordCompareDto,
  ): Promise<boolean> {
    const providedSaltedPassword =
      passwordCompareDto.password + passwordCompareDto.passwordSalt;
    return await bcrypt.compare(
      providedSaltedPassword,
      passwordCompareDto.hashedSaltedPassword,
    );
  }
}
