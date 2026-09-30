const taskService = require("../services/taskService");

const getAllTasks = (req, res) => {
    const tasks = taskService.getAllTasks();

    res.status(200).json(tasks);
};

const getTaskById = (req, res) => {
    const id = Number(req.params.id);
    const task = taskService.getTaskById(id);

    res.status(200).json(task);
};

const createTask = (req, res) => {
    const task = taskService.createTask(req.body);

    res.status(201).json(task);
};

const updateTask = (req, res) => {
    const id = Number(req.params.id);
    const task = taskService.updateTask(id, req.body);

    res.status(200).json(task);
};

const deleteTask = (req, res) => {
    const id = Number(req.params.id);
    taskService.deleteTask(id);

    res.status(200).json({
        message: "Task deleted successfully"
    });
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};