import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Roles } from '../../shared/enums/roles.enum';
import { UserStatus } from '../../shared/enums/user-status.enum';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsEnum(Roles)
  role: Roles;
}