import { Socket } from 'socket.io';
import { UserType } from './user.type';

export type AuthenticatedSocket = Socket & {
  user?: UserType;
};
