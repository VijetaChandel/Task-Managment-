const express = require('express');
const { register, login, getAllUsers, updateUser, deleteUser } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use(protect);
router.get('/users', adminOnly, getAllUsers);
router.patch('/users/:id', adminOnly, updateUser);
router.delete('/users/:id', adminOnly, deleteUser);

module.exports = router;
