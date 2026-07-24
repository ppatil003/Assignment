import express from 'express';
import cors from 'cors';
import dns from 'node:dns';
import mongoose from 'mongoose';
import config from './config.js';
import employeeRoutes from './routes/employees.js';
import departmentRoutes from './routes/departments.js';
import reviewRoutes from './routes/reviews.js';
import dailyWorkRoutes from './routes/dailywork.js';
import adminDashboardRoutes from './routes/adminDashboard.js';

const app = express();
const port = config.port;

if (config.dnsServers.length > 0) {
  dns.setServers(config.dnsServers);
}

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dailywork', dailyWorkRoutes);
app.use('/api/dashboard/admin', adminDashboardRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from CoReCo server!' });
});

async function startServer() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

startServer();
