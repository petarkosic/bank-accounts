import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import clientsRoute from './routes/clientsRoute.js';
import moneyTransferRoute from './routes/moneyTransferRoute.js';
import tellersRoute from './routes/tellersRoute.js';
import verifyToken from './middleware/verifyToken.js';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' })
})

app.use('/clients', verifyToken, clientsRoute);
app.use('/money-transfer', verifyToken, moneyTransferRoute);
app.use('/tellers', tellersRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})