import express from 'express';
import pool from "./db";
import route from './routes';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(route);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

async function createMeasureTable() {
  try {
    const [rows, fields] = await pool.execute(`
      CREATE TABLE IF NOT EXISTS measures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        measure_value DECIMAL(10, 2),
        measure_uuid VARCHAR(36),
        measure_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        measure_type VARCHAR(5),
        has_confirmed BOOLEAN DEFAULT FALSE
      );
    `);
    console.log('Tabela Measures configurada com sucesso!');
  } catch (error) {
    console.error('Erro ao tentar criar a tabela Measures:', error);
  }
}

createMeasureTable();