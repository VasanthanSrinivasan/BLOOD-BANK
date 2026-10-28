import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, password: { type: String, required: true }, role: { type: String, enum: ['admin', 'staff'], default: 'staff' }, active: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.model('User', schema);
