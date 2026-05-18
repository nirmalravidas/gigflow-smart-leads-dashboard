import "dotenv/config";

const getEnv = (key: string, defaultValue?: string): string => {
  return process.env[key] || defaultValue || "";
};

const assertRequired = (key: string): void => {
  if (!process.env[key] || String(process.env[key]).trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
};

export const config = {
  server: {
    nodeEnv: getEnv("NODE_ENV", "development"),
    port: Number(getEnv("PORT", "5000")),
    isProduction: getEnv("NODE_ENV", "development") === "production",
  },

  database: {
    uri: getEnv("MONGODB_URI"),
  },

  jwt: {
    secret: getEnv("JWT_SECRET"),
    expiresIn: getEnv("JWT_EXPIRES_IN", "7d"),
    refreshSecret: getEnv("JWT_REFRESH_SECRET"),
    refreshExpiresIn: getEnv("JWT_REFRESH_EXPIRES_IN", "30d"),
  },

  email: {
    host: getEnv("SMTP_HOST"),
    port: Number(getEnv("SMTP_PORT", "587")),
    secure: getEnv("SMTP_SECURE", "false") === "true",
    user: getEnv("SMTP_USER"),
    pass: getEnv("SMTP_PASS"),
    fromName: getEnv("EMAIL_FROM_NAME", "Smart Leads"),
    fromAddress: getEnv("EMAIL_FROM_ADDRESS"),
  },

  client: {
    url: getEnv("CLIENT_URL"),
  },

  rateLimit: {
    windowMs: Number(getEnv("RATE_LIMIT_WINDOW_MS", "900000")),
    max: Number(getEnv("RATE_LIMIT_MAX", "100")),
  },

  bcrypt: {
    saltRounds: Number(getEnv("BCRYPT_SALT_ROUNDS", "12")),
  },
} as const;

// Validate required env vars early (especially important for deployments)
(() => {
  assertRequired("MONGODB_URI");
  assertRequired("JWT_SECRET");
  assertRequired("JWT_REFRESH_SECRET");
  assertRequired("CLIENT_URL");

  if (config.server.isProduction) {
    assertRequired("SMTP_HOST");
    assertRequired("SMTP_USER");
    assertRequired("SMTP_PASS");
    assertRequired("EMAIL_FROM_ADDRESS");
  }
})();
