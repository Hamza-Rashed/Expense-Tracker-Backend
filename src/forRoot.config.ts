import * as Joi from 'joi';

const RootConfigurations = {
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    JWT_PRIVATE_KEY_PATH: Joi.string().required(),
    JWT_PUBLIC_KEY_PATH: Joi.string(),
    JWT_SECRET: Joi.string(),
    ACCESS_TOKEN_EXPIRY: Joi.string().default('15m'),
    REFRESH_TOKEN_EXPIRY_MS: Joi.number().default(2592000000), // 30 days
    MAX_LOGIN_ATTEMPTS: Joi.number().default(5),
    CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  }),
};

export default RootConfigurations;
