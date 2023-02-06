import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export default async function transformAndValidate<T extends object>(
  schema: { new (): T },
  data: any,
  options?: ClassTransformOptions,
): Promise<T> {
  const target = plainToInstance(schema, data, options);
  await validateOrReject(target);
  return target;
}
