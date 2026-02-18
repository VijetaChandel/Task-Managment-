const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await Project.create({ name, description, createdBy: req.user.id });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('createdBy', 'name');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
