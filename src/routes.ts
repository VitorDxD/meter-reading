import { Router, Request, Response } from 'express';
import { hello, upload, confirm, list } from './controllers/MeasureController';
import { promises as fs } from 'fs'; // Importação com promises para operações assíncronas
import path from 'path';

const route = Router();

route.get('/', hello);
route.post('/upload', upload);
route.patch('/confirm', confirm);
route.get('/:customerCode/list', list);

route.get('/:fileName', async (req: Request, res: Response): Promise<any> => {
    const filePath = path.join('temp', req.params.fileName);
    try {
        const data = await fs.readFile(filePath);
        res.contentType('image/png');
        res.send(data);
    } catch (error) {
        res.status(404).send('Imagem não encontrada');
    }
});

export default route;