import express from 'express';
import { Review } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, department, cycle, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (department) filter.department = department;
    if (cycle) filter.cycle = cycle;

    const skip = (Number(page) - 1) * Number(limit);
    const reviews = await Review.find(filter)
      .populate('employee', 'name employeeId')
      .populate('department', 'name')
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments(filter);
    res.json({ data: reviews, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('employee', 'name employeeId')
      .populate('department', 'name');

    if (!updated) return res.status(404).json({ error: 'Review not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
