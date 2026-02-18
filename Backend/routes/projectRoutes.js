const express = require('express');
const { createProject, getProjects, deleteProject } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.post('/', adminOnly, createProject);
router.delete('/:id', adminOnly, deleteProject);

module.exports = router;
