const express = require('express');
const { createTask, getTasks, updateTaskStatus, addComment, deleteTask, getTaskStats, updateTask } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.get('/stats', adminOnly, getTaskStats);
router.post('/', adminOnly, createTask);
router.get('/', getTasks);
router.patch('/:id/status', updateTaskStatus);
router.patch('/:id', adminOnly, updateTask);
router.post('/:id/comments', addComment);
router.delete('/:id', adminOnly, deleteTask);

module.exports = router;
