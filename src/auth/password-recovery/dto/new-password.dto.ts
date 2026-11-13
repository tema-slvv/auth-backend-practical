import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsString({ message: 'Password must be string' })
  @MinLength(6, { message: 'Min length 6 ' })
  @IsNotEmpty({ message: 'Password must not be empty' })
  password!: string;
}
