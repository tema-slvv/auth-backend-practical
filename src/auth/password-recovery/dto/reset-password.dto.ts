import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Enter correct email' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  email!: string;
}
