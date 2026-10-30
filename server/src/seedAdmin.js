import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blood_bank_db');
const email = process.env.ADMIN_EMAIL || 'admin@bloodbank.local';
const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
if (await User.exists({email})) console.log(`Admin already exists: ${email}`);
else { await User.create({name:'System Admin',email,password:await bcrypt.hash(password,12),role:'admin'}); console.log(`Created admin ${email}. Change the default password after first login.`); }
await mongoose.disconnect();
