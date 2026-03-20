import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationResponseDto } from 'src/shared/dtos/pagination-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    // Проверяем, нет ли уже юзера с таким email
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Создаём пользователя в базе
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    // Собираем ответ через DTO
    return new UserResponseDto(user);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return new UserResponseDto(user);
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return new UserResponseDto(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserResponseDto(user));
  }

  async findAllWithPagination(page: number, limit: number) {
    const users = await this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        campaignsAsPlayer: true,
      },
    });
    const total = await this.prisma.user.count();
    return new PaginationResponseDto(
      total,
      page,
      limit,
      users.map((user) => new UserResponseDto(user)),
    );
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return new UserResponseDto(user);
  }
}
