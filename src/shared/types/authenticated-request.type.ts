import { UserType } from './user.type';

export type AuthenticatedRequest = Request & {
  user: UserType;
};
