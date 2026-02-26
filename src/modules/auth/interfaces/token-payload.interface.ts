import { TokenType } from './token-types.enum';
import { UserType } from 'src/shared/types/user.type';

export interface TokenPayload {
  type: TokenType;
  user: UserType;
}
