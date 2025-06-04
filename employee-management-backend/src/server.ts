import express, { Express } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

const PORT: string | number = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));