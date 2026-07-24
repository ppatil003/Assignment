import express from 'express';
import mongoose from 'mongoose';
import { Department, Employee, Review } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().populate('hod', 'name employeeId');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const department = new Department(req.body);
    const saved = await department.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('hod', 'name employeeId');
    if (!updated) return res.status(404).json({ error: 'Department not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Department not found' });
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/dashboard', async (req, res) => {
  try {
    const departmentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ error: 'Invalid department id' });
    }

    const department = await Department.findById(departmentId).populate('hod', 'name employeeId');
    if (!department) return res.status(404).json({ error: 'Department not found' });

    const [employeeCount, activeReviews, completedReviews] = await Promise.all([
      Employee.countDocuments({ department: departmentId }),
      Review.countDocuments({ department: departmentId, status: { $in: ['Submitted', 'Under Review', 'Rework Requested'] } }),
      Review.countDocuments({ department: departmentId, status: 'Completed' }),
    ]);

    const avgRatingResult = await Employee.aggregate([
      { $match: { department: new mongoose.Types.ObjectId(departmentId), rating: { $ne: null } } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    const averageRating = avgRatingResult[0]?.averageRating ?? 0;

    res.json({
      department,
      stats: {
        employeeCount,
        activeReviews,
        completedReviews,
        averageRating,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
