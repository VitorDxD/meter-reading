import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'measure'
});

export default pool;