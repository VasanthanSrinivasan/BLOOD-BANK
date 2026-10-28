import mongoose from 'mongoose';
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const schema = new mongoose.Schema({ donorId: { type: String, unique: true }, name: { type: String, required: true, trim: true }, age: { type: Number, required: true, min: 18, max: 65 }, gender: { type: String, enum: ['Female', 'Male', 'Other'], required: true }, bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true }, phone: { type: String, required: true, trim: true }, email: { type: String, lowercase: true, trim: true }, city: { type: String, required: true, trim: true }, lastDonationDate: Date, active: { type: Boolean, default: true }, notes: { type: String, maxlength: 500 } }, { timestamps: true });
schema.pre('save', function(next) { if (!this.donorId) this.donorId = `DNR-${Date.now().toString().slice(-8)}`; next(); });
export default mongoose.model('Donor', schema);
