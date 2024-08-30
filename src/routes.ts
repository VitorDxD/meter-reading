import { Router } from 'express';
import { hello, upload, confirm, list } from './controllers/MeasureController';

const route = Router();

route.get('/', hello);
route.post('/upload', upload);
route.patch('/confirm', confirm);
route.get('/:customerCode/list', list);

export default route;