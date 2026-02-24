import { UserResponseDto } from "src/users/dto/user-response.dto";
import { TokenType } from "./token-types.enum";

export interface TokenPayload {
  type: TokenType;
  user: UserResponseDto;
}