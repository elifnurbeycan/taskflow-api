const tasks = require("../data/tasks");
const Task = require("../entities/Task");
const AppError = require("../errors/AppError");
const ErrorCodes = require("../errors/errorCodes");

const getAllTasks = () => {
    return tasks.filter(task => task.active);
};

const getTaskById = (id) => {
    const task = tasks.find(task => task.id === id && task.active);

    if (!task) {
        throw new AppError(
            "Task not found",
            404,
            ErrorCodes.TASK_NOT_FOUND
        );
    }

    return task;
};

const createTask = (taskData) => {
    const id = tasks.length + 1;

    const task = new Task(
        id,
        taskData.title,
        taskData.description,
        taskData.projectId,
        taskData.assignee,
        taskData.priority,
        taskData.dueDate
    );

    tasks.push(task);

    return task;
};

const updateTask = (id, taskData) => {
    
    const task = getTaskById(id);

    if (taskData.title !== undefined) {
        task.title = taskData.title;
    }

    if (taskData.description !== undefined) {
        task.description = taskData.description;
    }

    if (taskData.projectId !== undefined) {
    task.projectId = taskData.projectId;
    }

    if (taskData.assignee !== undefined) {
    task.assignee = taskData.assignee;
    }

    if (taskData.status !== undefined) {
        task.status = taskData.status;
    }

    if (taskData.priority !== undefined) {
        task.priority = taskData.priority;
    }

    if (taskData.dueDate !== undefined) {
        task.dueDate = taskData.dueDate;
    }

    task.updatedAt = new Date();
    task.version += 1;

    return task;
};

const deleteTask = (id) => {
    
    const task = getTaskById(id);

    task.active = false;
    task.updatedAt = new Date();
    task.version += 1;

    return task;
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};