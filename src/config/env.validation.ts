import { IsAlphanumeric, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class EnvironmentVariables {
  @IsString()
  DB_USER: string;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_PASS: string;

  @IsAlphanumeric()
  DB_PORT: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  EGGBOT_TOKEN: string;

  @IsString()
  EGGBOT_CLIENT_ID: string;
}

export function validate(configuration: Record<string, unknown>) {
  const config = plainToInstance(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(config, { skipMissingProperties: true });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return config;
}
