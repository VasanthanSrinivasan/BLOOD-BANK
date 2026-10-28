import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import donorRoutes from './routes/donors.js';
import inventoryRoutes from './routes/inventory.js';
import requestRoutes from './routes/requests.js';
import donationRoutes from './routes/donations.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Blood Bank API' }));
app.use('/api/auth', authRoutes);
app.use('/api/donors', requireAuth, donorRoutes);
app.use('/api/inventory', requireAuth, inventoryRoutes);
app.use('/api/requests', requireAuth, requestRoutes);
app.use('/api/donations', requireAuth, donationRoutes);
app.use('/api/dashboard', requireAuth, async (_req, res, next) => {
  try {
    const [Donor, Inventory, Request, Donation] = await Promise.all([
      import('./models/Donor.js'), import('./models/Inventory.js'), import('./models/BloodRequest.js'), import('./models/Donation.js')
    ]).then(x => x.map(m => m.default));
    const [donors, inventory, pendingRequests, donations, expiring] = await Promise.all([
      Donor.countDocuments({ active: true }),
      Inventory.find({ units: { $gt: 0 } }),
      Request.countDocuments({ status: 'Pending' }),
      Donation.countDocuments(),
      Inventory.find({ units: { $gt: 0 }, expiryDate: { $lte: new Date(Date.now() + 7 * 86400000), $gte: new Date() } })
    ]);
    const stockByGroup = {};
    inventory.forEach(item => { stockByGroup[item.bloodGroup] = (stockByGroup[item.bloodGroup] || 0) + item.units; });
    const lowStock = Object.entries(stockByGroup).filter(([, units]) => units < Number(process.env.LOW_STOCK_THRESHOLD || 10)).map(([bloodGroup, units]) => ({ bloodGroup, units }));
    res.json({ donors, totalUnits: inventory.reduce((sum, item) => sum + item.units, 0), pendingRequests, donations, expiringUnits: expiring.reduce((sum, item) => sum + item.units, 0), stockByGroup, lowStock });
  } catch (error) { next(error); }
});
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
  if (err.code === 11000) return res.status(409).json({ message: 'A record with this value already exists.' });
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blood_bank_db')
  .then(() => app.listen(port, () => console.log(`Blood Bank API running on http://localhost:${port}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
