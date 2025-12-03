import {IsEmail, IsEnum, IsOptional, IsString, MinLength} from 'class-validator';
import { UserRole } from '../entities/user-role.enum';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail({}, { message: '正しいメールアドレス形式を入力してください' })
  email: string;

  @IsString({ message: '名前は文字列である必要があります' })
  name: string;

  @IsString()
  @MinLength(8, {message: 'パスワードは8文字以上にしてください'})
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: '不正なロール指定です' })
  role: UserRole;
}