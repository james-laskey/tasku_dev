import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { tasks, userData } from '../fakeTaskData.js';

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
    // First create a lookup object for users
    const users = Array.isArray(userData) ? userData : Object.values(userData);
    const userLookup = {};
    users.forEach(user => {
      if (user && user.uid) {
        userLookup[user.uid] = {
          uid: user.uid,
          name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
          email: user.email || '',
          profilePicture: user.profilePicture || null
        };
      }
    });

    // Process tasks without using find()
    const result = tasks
      .filter(task => task.school === school && !task.completed)
      .map(task => ({
        ...task,
        user: userLookup[task.user] || null
      }));

    if (result.length === 0) {
      return res.status(404).json({ message: 'No uncompleted tasks found for the provided school.' });
    }

    console.log('Uncompleted tasks found:', result.length);
    res.status(200).json({ tasks: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};