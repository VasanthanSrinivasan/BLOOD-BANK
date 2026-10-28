import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router = Router();
const issue = user => ({ token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'development_only_change_me', { expiresIn: '8h' }), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
router.post('/register', [body('name').trim().notEmpty(), body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 8 })], async (req, res, next) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    const count = await User.countDocuments();
    if (count > 0 && (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) return res.status(403).json({ message: 'Registration is closed. Ask an administrator to create staff accounts.' });
    if (count > 0) {
      const token = req.headers.authorization.slice(7); const payload = jwt.verify(token, process.env.JWT_SECRET || 'development_only_change_me');
      const creator = await User.findById(payload.id); if (!creator || creator.role !== 'admin') return res.status(403).json({ message: 'Only administrators can create accounts.' });
    }
    const user = await User.create({ name: req.body.name, email: req.body.email, password: await bcrypt.hash(req.body.password, 12), role: count === 0 ? 'admin' : 'staff' });
    res.status(201).json(issue(user));
  } catch (e) { next(e); }
});
router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').notEmpty()], async (req, res, next) => {
  try { const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ message: 'Enter a valid email and password.' });
    const user = await User.findOne({ email: req.body.email });
    if (!user || !user.active || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json(issue(user));
  } catch (e) { next(e); }
});
router.get('/me', requireAuth, (req, res) => res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } }));
router.get('/users', requireAuth, requireRole('admin'), async (_req, res, next) => { try { res.json(await User.find().select('-password').sort({ createdAt: -1 })); } catch (e) { next(e); } });
router.patch('/users/:id/active', requireAuth, requireRole('admin'), async (req, res, next) => { try { if (String(req.user._id) === req.params.id) return res.status(400).json({ message: 'You cannot deactivate your own account.' }); const user = await User.findByIdAndUpdate(req.params.id, { active: !!req.body.active }, { new: true }).select('-password'); if (!user) return res.status(404).json({ message: 'User not found.' }); res.json(user); } catch (e) { next(e); } });
export default router;
