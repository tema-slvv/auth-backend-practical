import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register.dto';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
  public validate(passwordReapeat: string, args: ValidationArguments) {
    const obj = args.object as RegisterDto;
    return obj.password === passwordReapeat;
  }

  public defaultMessage(validationArguments?: ValidationArguments) {
    return 'Passwords do not match';
  }
}
