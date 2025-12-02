import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsULID(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isULID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          
          // ULID pattern: 26 characters, base32 encoded
          const ulidPattern = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i;
          
          if (!ulidPattern.test(value)) {
            return false;
          }
          
          // Basic ULID structure validation - just check format, not timestamp
          try {
            // First 10 characters are timestamp, last 16 are random
            const timestamp = value.substring(0, 10);
            const random = value.substring(10);
            
            // Just ensure they are valid base32
            const base32Pattern = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]+$/i;
            return base32Pattern.test(timestamp) && base32Pattern.test(random);
          } catch (error) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ULID`;
        },
      },
    });
  };
}

export function IsULIDArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isULIDArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }
          
          const ulidPattern = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i;
          
          return value.every(item => {
            if (typeof item !== 'string') {
              return false;
            }
            return ulidPattern.test(item);
          });
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of valid ULIDs`;
        },
      },
    });
  };
}
