import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: "+07:00",

  ssl: {
    rejectUnauthorized: true,
  },

  waitForConnections: true,
  connectionLimit: 10,
});