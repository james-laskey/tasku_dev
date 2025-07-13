import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { tasks } from '../fakeTaskData.js';

export const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const taskid = uuidv4();
  const task = { ...req.body, taskid };

  try {
    console.log('Creating task with data:', task);
    res.status(201).json({ message: 'Task created successfully!', task });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUncompletedTasks = async (req, res) => {
  const { school } = req.query;

  if (!school) {
    return res.status(400).json({ error: 'School must be provided in the query string.' });
  }

  try {
    const result = tasks.filter(task => task.school === school && !task.completed);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No uncompleted tasks found for the provided school.' });
    }

    res.status(200).json({ tasks: result });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};