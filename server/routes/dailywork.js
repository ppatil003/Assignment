import express from 'express';
import { DailyWork } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { employee, startDate, endDate, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (employee) filter.employee = employee;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const dailyEntries = await DailyWork.find(filter)
      .populate('employee', 'name employeeId')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await DailyWork.countDocuments(filter);
    res.json({ data: dailyEntries, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const entry = new DailyWork(req.body);
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await DailyWork.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('employee', 'name employeeId');
    if (!updated) return res.status(404).json({ error: 'DailyWork entry not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
