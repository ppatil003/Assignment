import express from 'express';
import mongoose from 'mongoose';
import { Employee, Department, Review, DailyWork } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [employeeCount, departmentCount, reviewStats, todaysDailyWorkCount] = await Promise.all([
      Employee.countDocuments(),
      Department.countDocuments(),
      Review.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      DailyWork.countDocuments({ date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    ]);

    const reviewByStatus = reviewStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const completionTrend = await Review.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const departmentBreakdown = await Review.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department',
        },
      },
      { $unwind: '$department' },
      {
        $project: {
          _id: 0,
          department: '$department.name',
          count: 1,
        },
      },
    ]);

    res.json({
      summary: {
        employeeCount,
        departmentCount,
        activeReviewCount: reviewByStatus.Submitted || 0,
        completedReviewCount: reviewByStatus.Completed || 0,
        todaysDailyWorkCount,
      },
      charts: {
        completionTrend,
        departmentBreakdown,
      },
      reviewByStatus,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
