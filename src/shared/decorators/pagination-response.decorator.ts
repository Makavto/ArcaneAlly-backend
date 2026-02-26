import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseNoStatusOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';

export const PaginationResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  options?: ApiResponseNoStatusOptions,
) =>
  applyDecorators(
    ApiExtraModels(PaginationResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
      ...options,
    }),
  );
