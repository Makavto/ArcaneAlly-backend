export class UserResponseDto {
  id: string;
  email: string;
  role: 'GM' | 'PLAYER';
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
