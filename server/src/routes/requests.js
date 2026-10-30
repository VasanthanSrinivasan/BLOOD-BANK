import { Router } from 'express';
import mongoose from 'mongoose';
import BloodRequest from '../models/BloodRequest.js';
import Inventory from '../models/Inventory.js';
import { requireRole } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req,res,next) => { try { const filter = {}; if(req.query.status) filter.status = req.query.status; if(req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup; res.json(await BloodRequest.find(filter).populate('processedBy','name').sort({createdAt:-1})); } catch(e) { next(e); } });
router.post('/', async (req,res,next) => { try { res.status(201).json(await BloodRequest.create(req.body)); } catch(e) { next(e); } });
router.patch('/:id/status', requireRole('admin'), async (req,res,next) => {
  const session = await mongoose.startSession();
  try {
    const { status } = req.body; if(!['Approved','Rejected','Fulfilled'].includes(status)) return res.status(400).json({message:'Invalid status.'});
    let result;
    await session.withTransaction(async () => {
      const item = await BloodRequest.findById(req.params.id).session(session); if(!item) { const e = new Error('Request not found.'); e.status=404; throw e; }
      if(status === 'Fulfilled' && item.status !== 'Fulfilled') {
        let remaining = item.units;
        const batches = await Inventory.find({bloodGroup:item.bloodGroup, units:{$gt:0}, expiryDate:{$gt:new Date()}}).sort({expiryDate:1,collectionDate:1}).session(session);
        const available = batches.reduce((sum,b) => sum+b.units,0); if(available < remaining) { const e = new Error(`Insufficient unexpired ${item.bloodGroup} stock. Available: ${available} units.`); e.status=400; throw e; }
        for(const batch of batches) { if(remaining<=0) break; const take=Math.min(batch.units,remaining); batch.units-=take; remaining-=take; await batch.save({session}); }
      }
      item.status=status; item.processedBy=req.user._id; item.processedAt=new Date(); await item.save({session}); result=item;
    });
    res.json(result);
  } catch(e) { next(e); } finally { await session.endSession(); }
});
router.delete('/:id', requireRole('admin'), async (req,res,next) => { try { const item = await BloodRequest.findByIdAndDelete(req.params.id); if(!item) return res.status(404).json({message:'Request not found.'}); res.json({message:'Request deleted.'}); } catch(e) { next(e); } });
export default router;
