import { Router } from 'express';
import Inventory from '../models/Inventory.js';
import { requireRole } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req,res,next) => { try { const filter = {}; if(req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup; if(req.query.expiring === 'true') filter.expiryDate = { $lte: new Date(Date.now()+30*86400000) }; const items = await Inventory.find(filter).populate('donor','name donorId').sort({expiryDate:1}); res.json(items); } catch(e) { next(e); } });
router.post('/', async (req,res,next) => { try { const item = await Inventory.create(req.body); res.status(201).json(item); } catch(e) { next(e); } });
router.put('/:id', async (req,res,next) => { try { const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true}); if(!item) return res.status(404).json({message:'Inventory batch not found.'}); res.json(item); } catch(e) { next(e); } });
router.delete('/:id', requireRole('admin'), async (req,res,next) => { try { const item = await Inventory.findByIdAndDelete(req.params.id); if(!item) return res.status(404).json({message:'Inventory batch not found.'}); res.json({message:'Inventory batch deleted.'}); } catch(e) { next(e); } });
export default router;
