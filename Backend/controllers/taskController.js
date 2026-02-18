const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, project } = req.body;
        const task = await Task.create({
            title,
            description,
            assignedTo,
            project,
            createdBy: req.user.id
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Developer') {
            query.assignedTo = req.user.id;
        }
        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name')
            .populate('project', 'name')
            .populate('comments.user', 'name');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Developers can only update their own assigned tasks
        if (req.user.role === 'Developer' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        task.status = status;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.comments.push({ user: req.user.id, text });
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Only admins can delete tasks' });
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTaskStats = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const total = await Task.countDocuments();
        const result = {
            'Total': total,
            'Pending': 0,
            'In Progress': 0,
            'Completed': 0
        };
        stats.forEach(s => {
            result[s._id] = s.count;
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin access required' });
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
