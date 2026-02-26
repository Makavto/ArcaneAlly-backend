import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from '../dto/user-response.dto';
import { Roles } from 'src/modules/auth/decorators/auth-roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { PaginationRequestDto } from 'src/shared/dtos/pagination-request.dto';
import { PaginationResponse } from 'src/shared/decorators/pagination-response.decorator';
import { PaginationResponseDto } from 'src/shared/dtos/pagination-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request.type';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Регистрация нового пользователя
  @Post()
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  @ApiResponse({ status: 400, description: 'Форма не прошла валидацию' })
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @PaginationResponse(UserResponseDto, {
    description: 'Пользователи успешно получены',
  })
  @ApiBearerAuth()
  @Roles(Role.PLAYER)
  @UseGuards(AuthGuard)
  async findAll(
    @Query() query: PaginationRequestDto,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    return this.usersService.findAllWithPagination(
      Number(query.page),
      Number(query.limit),
    );
  }

  @Get('me')
  @ApiOperation({ summary: 'Получение текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Текущий пользователь успешно получен',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  @ApiBearerAuth()
  @Roles(Role.PLAYER)
  @UseGuards(AuthGuard)
  async findMe() {
    return this.usersService.findById(2);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Обновление текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно обновлен',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  @ApiBearerAuth()
  @Roles(Role.PLAYER)
  @UseGuards(AuthGuard)
  async update(@Body() dto: UpdateUserDto, @Req() req: AuthenticatedRequest) {
    return this.usersService.update(req.user.id, dto);
  }

  // Получение пользователя по ID
  @Get(':id')
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно получен',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  @ApiBearerAuth()
  @Roles(Role.PLAYER)
  @UseGuards(AuthGuard)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }
}
