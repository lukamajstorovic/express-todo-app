module.exports = {
  HOST: "HOST",
  USER: "USER",
  PASSWORD: "PASSWORD",
  DB: "DB_NAME",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  secretKey: "SECRET_KEY"
};
