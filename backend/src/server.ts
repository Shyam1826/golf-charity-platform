import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import charityRoutes from './routes/charityRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import scoreRoutes from './routes/scoreRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Golf Charity Platform API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
