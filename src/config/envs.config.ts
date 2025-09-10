import 'dotenv/config';
import * as Joi from 'joi';

type NodeEnv = 'development' | 'production' | 'test';
interface EnvVars {
  PORT: number;
  JWT_SECRET: string;
  DATABASE_URL: string;
  JWT_EXPIRES_IN: string;
  MONGOOSE_URL: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  URL_FRONTEND: string;
  GOOGLE_REDIRECT_URI: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_REDIRECT_URI: string;
  NODE_ENV?: NodeEnv;
}

const envVarsSchema = Joi.object({
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required().description('JWT Secret key'),
  DATABASE_URL: Joi.string()
    .required()
    .description('Database connection string'),
  JWT_EXPIRES_IN: Joi.string().default('1d').description('JWT expiration time'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .description('Application environment'),
  JWT_REFRESH_SECRET: Joi.string(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
  URL_FRONTEND: Joi.string()
    .uri()
    .required()
    .description('URL of the frontend application'),
  GOOGLE_REDIRECT_URI: Joi.string()
    .uri()
    .required()
    .description('Google OAuth redirect URI'),
  GOOGLE_CLIENT_ID: Joi.string()
    .required()
    .description('Google OAuth client ID'),
  GOOGLE_CLIENT_SECRET: Joi.string()
    .required()
    .description('Google OAuth client secret'),
  DISCORD_CLIENT_ID: Joi.string()
    .required()
    .description('Discord OAuth client ID'),
  DISCORD_CLIENT_SECRET: Joi.string()
    .required()
    .description('Discord OAuth client secret'),
  DISCORD_REDIRECT_URI: Joi.string()
    .uri()
    .required()
    .description('Discord OAuth redirect URI'),
}).unknown(true);

const validatedEnvVars = envVarsSchema.validate(process.env);

if (validatedEnvVars.error) {
  throw new Error(`Config validation error: ${validatedEnvVars.error.message}`);
}

const envVars = validatedEnvVars.value as EnvVars;

export const envs = {
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  databaseUrl: envVars.DATABASE_URL,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  nodeEnv: envVars.NODE_ENV || 'development',
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
  urlFrontend: envVars.URL_FRONTEND,
  googleRedirectUri: envVars.GOOGLE_REDIRECT_URI,
  googleClientId: envVars.GOOGLE_CLIENT_ID,
  googleClientSecret: envVars.GOOGLE_CLIENT_SECRET,
  discordClientId: envVars.DISCORD_CLIENT_ID,
  discordClientSecret: envVars.DISCORD_CLIENT_SECRET,
  discordRedirectUri: envVars.DISCORD_REDIRECT_URI,
};
