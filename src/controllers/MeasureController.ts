import { Request, Response } from 'express';
import aiQuery from '../utils/gemini';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import pool from '../db';

export const hello = (req: Request, res: Response) => {
    res.send('Olá, Mundo!');
};

export const upload = async (req: Request, res: Response) => {
    const prompt: string = "Qual a medição que você vê nesse medidor? Me diga APENAS o número e nada mais.";
    const tempDir: string = 'temp';
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    interface ResponseData {
        image_url: string,
        measure_value: number,
        measure_uuid: string
    };
    
    if (typeof(image) != 'string' || typeof(customer_code) != 'string' ||
        !validateDateTime(measure_datetime) || !(['WATER', 'GAS'].includes(measure_type))) {

        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "Os dados fornecidos no corpo da requisição são inválidos"
        });
    }

    try {
        await fs.mkdir(tempDir, { recursive: true });
        
        const fileName = uuidv4();
        const filePath = path.join(tempDir, `${fileName}.png`);
        await fs.writeFile(filePath, image, 'base64');

        const measure_value = Number(await aiQuery(prompt, filePath));

        const responseData: ResponseData = {
            image_url: `http://localhost:3000/${fileName}.png`,
            measure_value,
            measure_uuid: fileName
        };

        const [rows] = await pool.query('SELECT * FROM measures WHERE measure_type = ? AND MONTH(measure_datetime) = MONTH(?)', [measure_type, measure_datetime]);
        
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({
                error_code: "DOUBLE_REPORT",
                error_description: "Leitura do mês já realizada"
            });
        }

        try {
            const [results, fields] = await pool.query('INSERT INTO measures (customer_code, measure_value, measure_uuid, measure_datetime, measure_type) VALUES (?, ?, ?, ?, ?)', [customer_code, measure_value, fileName, new Date(), measure_type]);
            res.status(200).json({
                message: 'Operação realizada com sucesso',
                data: responseData
            });
        } catch (error) {
            console.error('Erro ao tentar inserir registro:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }

    } catch (error) {
        console.error('Erro ao tentar acessar a rota de leitura:', error);
    }
};

export const confirm = (req: Request, res: Response) => {
    res.send('Rota de confirmação');
};

export const list = (req: Request, res: Response) => {
    const customerCode: any = req.params.customerCode;
    res.send(customerCode);
};

function validateDateTime(dateTime: any) {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    return regex.test(dateTime);
}