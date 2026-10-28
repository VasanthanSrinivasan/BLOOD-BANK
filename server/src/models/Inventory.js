import mongoose from 'mongoose';
import { BLOOD_GROUPS } from './Donor.js';
const schema = new mongoose.Schema({ bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true }, units: { type: Number, required: true, min: 0 }, collectionDate: { type: Date, required: true }, expiryDate: { type: Date, required: true }, donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' }, source: { type: String, default: 'Donation' }, notes: { type: String, maxlength: 500 } }, { timestamps: true });
schema.pre('validate', function(next) { if (this.expiryDate && this.collectionDate && this.expiryDate <= this.collectionDate) this.invalidate('expiryDate', 'Expiry date must be after collection date.'); next(); });
export default mongoose.model('Inventory', schema);
