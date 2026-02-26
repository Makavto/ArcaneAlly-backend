import { Role } from '@prisma/client';

export type UserType = {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
};
