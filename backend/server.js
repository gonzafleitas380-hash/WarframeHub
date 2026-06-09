import express from 'express';
import cors from 'cors';
import warframesRouter from './routes/warframes.js';
import marketRouter from './routes/market.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use('/api/warframes', warframesRouter);
app.use('/api/market', marketRouter);
app.use('/api', authRouter);

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});