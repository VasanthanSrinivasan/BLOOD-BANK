import mongoose from 'mongoose';
import { BLOOD_GROUPS } from './Donor.js';
const schema = new mongoose.Schema({ donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true }, bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true }, units: { type: Number, min: 1, max: 2, required: true }, donationDate: { type: Date, required: true }, screeningStatus: { type: String, enum: ['Pending', 'Eligible', 'Deferred'], default: 'Pending' }, notes: { type: String, maxlength: 500 } }, { timestamps: true });
export default mongoose.model('Donation', schema);
