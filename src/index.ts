import express from 'express';
import rebelsRouter from './routes/rebels'
import cors from 'cors';

const app = express();

app.use(function (_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Origin');
    next();
});

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use('/',rebelsRouter);

app.use(function (_req, res, _next) {
    res.status(404).send();
});

app.listen(PORT, () => {
    console.log('Servidor corriendo');
});