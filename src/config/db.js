import mysql from "mysql2/promise";

let pool;

export const initDB = async () => {
    const tempConn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    await tempConn.execute(
        `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );
    await tempConn.end();

    pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
    });

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Database connected & tables ready ✅");
};

const getPool = () => pool;

export default new Proxy({}, {
    get(_, prop) {
        return (...args) => pool[prop](...args);
    },
});
