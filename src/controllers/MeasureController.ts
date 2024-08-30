import { Request, Response } from 'express';
import aiQuery from '../utils/gemini';

export const hello = (req: Request, res: Response) => {
    res.send('Olá, Mundo!');
};

export const upload = async (req: Request, res: Response) => {
    const prompt: string = "Me diga o que você vê na foto";
    const base64: string = req.body.image;

    //aiQuery(prompt, base64);
    //res.send('Rota de upload');

    return await aiQuery(prompt, base64);
};

export const confirm = (req: Request, res: Response) => {
    res.send('Rota de confirmação');
};

export const list = (req: Request, res: Response) => {
    const customerCode: any = req.params.customerCode;
    res.send(customerCode);
};