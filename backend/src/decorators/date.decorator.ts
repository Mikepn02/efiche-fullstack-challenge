import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true;
          const date = new Date(value);
          const now = new Date();
          return date.setHours(0, 0, 0, 0) >= now.setHours(0, 0, 0, 0);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be in the past`;
        },
      },
    });
  };
}


export function IsAfter(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!value || !relatedValue) return true; // let other decorators handle empty/invalid values

          return new Date(value) > new Date(relatedValue);
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be after ${relatedPropertyName}`;
        },
      },
    });
  };
}