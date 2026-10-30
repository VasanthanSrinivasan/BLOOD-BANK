import { Router } from 'express';
import mongoose from 'mongoose';
import Donation from '../models/Donation.js';
import Donor from '../models/Donor.js';
import Inventory from '../models/Inventory.js';
import { requireRole } from '../middleware/auth.js';
const router = Router();
router.get('/', async (_req,res,next) => { try { res.json(await Donation.find().populate('donor','name donorId bloodGroup').sort({donationDate:-1})); } catch(e) { next(e); } });
router.post('/', async (req,res,next) => {
  const session = await mongoose.startSession();
  try {
    let donation;
    await session.withTransaction(async () => {
      const donor = await Donor.findById(req.body.donor).session(session); if(!donor || !donor.active) { const e=new Error('Active donor not found.'); e.status=400; throw e; }
      if(donor.bloodGroup !== req.body.bloodGroup) { const e=new Error('Blood group must match the donor record.'); e.status=400; throw e; }
      donation = (await Donation.create([{...req.body}], {session}))[0];
      if(donation.screeningStatus === 'Eligible') {
        const collectionDate = new Date(donation.donationDate); const expiryDate = new Date(collectionDate); expiryDate.setDate(expiryDate.getDate()+35);
        await Inventory.create([{bloodGroup:donation.bloodGroup,units:donation.units,collectionDate,expiryDate,donor:donor._id,source:'Donation'}],{session});
        donor.lastDonationDate = donation.donationDate; await donor.save({session});
      }
    });
    res.status(201).json(await donation.populate('donor','name donorId bloodGroup'));
  } catch(e) { next(e); } finally { await session.endSession(); }
});
router.delete('/:id', requireRole('admin'), async (req,res,next) => { try { const item = await Donation.findByIdAndDelete(req.params.id); if(!item) return res.status(404).json({message:'Donation not found.'}); res.json({message:'Donation record deleted. Note: related inventory is not automatically reversed; reconcile stock manually.'}); } catch(e) { next(e); } });
export default router;
