const path = require("path");

//if (process.env.USER)            <-- add to next line
require("dotenv").config();

// const {                         <-- replace next line with this
//   DATABASE_URL = "postgresql://postgres@localhost/postgres",
// } = process.env;

const { DATABASE_URL = "postgresql://postgres@localhost:5432/postgres", PRODUCTION_DATABASE_URL } =
  process.env;
const URL =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_DATABASE_URL
    : DATABASE_URL;

module.exports = {
  development: {
    client: "postgresql",
    connection: URL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },

  production: {
    client: "postgresql",
    connection: {
      connectionString: URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    useNullAsDefault: true,
  },
};