import express from 'express';
import rebelsRouter from './routes/rebels'

const app = express();
app.use(express.json());

const PORT = 3000;

app.use('/',rebelsRouter);

app.listen(PORT, () => {
    console.log('Servidor corriendo');
});