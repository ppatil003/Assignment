import express from 'express';
import { Employee } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, department, designation, status, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex },
        { employeeId: regex },
        { designation: regex },
        { contactNumber: regex },
      ];
    }
    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const employees = await Employee.find(filter)
      .populate('department', 'name')
      .populate('manager', 'name employeeId')
      .skip(skip)
      .limit(Number(limit));

    const total = await Employee.countDocuments(filter);
    res.json({ data: employees, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const saved = await employee.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Employee not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
