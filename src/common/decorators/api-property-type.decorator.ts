import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type as CTType } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export function ApiPropertyType<TModel extends Type<any>>(
  dataModel: TModel,
  required?: boolean,
) {
  return applyDecorators(
    ApiProperty({ title: dataModel.name, required: required }),
    ValidateNested(),
    CTType(() => dataModel),
  );
}
