const AppError = require("../errors/AppError");
const ErrorCodes = require("../errors/errorCodes");
const TaskStatus = require("../enums/taskStatus");
const TaskPriority = require("../enums/taskPriority");

const createValidationError = (details) => {
    return new AppError(
        "Validation failed",
        400,
        ErrorCodes.VALIDATION_ERROR,
        details
    );
};

const isValidBody = (body) => {
    return body && typeof body === "object" && !Array.isArray(body);
};

const validateTaskId = (req, res, next) => {
    const id = req.params.id;

    if (!/^\d+$/.test(id) || Number(id) <= 0) {
        return next(
            createValidationError([
                {
                    field: "id",
                    message: "Task id must be a positive integer"
                }
            ])
        );
    }

    next();
};

const validateCreateTask = (req, res, next) => {
    if (!isValidBody(req.body)) {
        return next(
            createValidationError([
                {
                    field: "body",
                    message: "Request body must be a JSON object"
                }
            ])
        );
    }

    const errors = [];
    const {
        title,
        description,
        projectId,
        assignee,
        priority,
        dueDate,
        status
    } = req.body;

    if (typeof title !== "string" || title.trim().length === 0) {
        errors.push({
            field: "title",
            message: "Title is required"
        });
    } else if (title.length > 150) {
        errors.push({
            field: "title",
            message: "Title cannot exceed 150 characters"
        });
    }

    if (!Number.isInteger(projectId) || projectId <= 0) {
        errors.push({
            field: "projectId",
            message: "Project id must be a positive integer"
        });
    }

    if (
        typeof assignee !== "string" ||
        assignee.trim().length === 0
    ) {
        errors.push({
            field: "assignee",
            message: "Assignee is required"
        });
    }

    if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
    ) {
        errors.push({
            field: "description",
            message: "Description must be a string"
        });
    }

    if (
        priority !== undefined &&
        !Object.values(TaskPriority).includes(priority)
    ) {
        errors.push({
            field: "priority",
            message: `Priority must be one of: ${Object.values(
                TaskPriority
            ).join(", ")}`
        });
    }

    if (
        dueDate !== undefined &&
        dueDate !== null &&
        Number.isNaN(Date.parse(dueDate))
    ) {
        errors.push({
            field: "dueDate",
            message: "Due date must be a valid date"
        });
    }

    if (status !== undefined) {
        errors.push({
            field: "status",
            message: "Status is assigned automatically when creating a task"
        });
    }

    if (errors.length > 0) {
        return next(createValidationError(errors));
    }

    next();
};

const validateUpdateTask = (req, res, next) => {
    if (!isValidBody(req.body)) {
        return next(
            createValidationError([
                {
                    field: "body",
                    message: "Request body must be a JSON object"
                }
            ])
        );
    }

    const errors = [];
    const { title, description, projectId, assignee, status, priority, dueDate } =
        req.body;

    const editableFields = [
        "title",
        "description",
        "projectId",
        "assignee",
        "status",
        "priority",
        "dueDate"
    ];

    const hasEditableField = editableFields.some(field =>
        Object.prototype.hasOwnProperty.call(req.body, field)
    );

    if (!hasEditableField) {
        errors.push({
            field: "body",
            message: "At least one editable task field must be provided"
        });
    }

    if (
        title !== undefined &&
        (typeof title !== "string" || title.trim().length === 0)
    ) {
        errors.push({
            field: "title",
            message: "Title cannot be empty"
        });
    } else if (typeof title === "string" && title.length > 150) {
        errors.push({
            field: "title",
            message: "Title cannot exceed 150 characters"
        });
    }

    if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
    ) {
        errors.push({
            field: "description",
            message: "Description must be a string"
        });
    }

    if (
        projectId !== undefined &&
        (!Number.isInteger(projectId) || projectId <= 0)
    ) {
        errors.push({
            field: "projectId",
            message: "Project id must be a positive integer"
        });
    }

    if (
        assignee !== undefined &&
        (
            typeof assignee !== "string" ||
            assignee.trim().length === 0
        )
    ) {
        errors.push({
            field: "assignee",
            message: "Assignee cannot be empty"
        });
    }

    if (
        status !== undefined &&
        !Object.values(TaskStatus).includes(status)
    ) {
        errors.push({
            field: "status",
            message: `Status must be one of: ${Object.values(
                TaskStatus
            ).join(", ")}`
        });
    }

    if (
        priority !== undefined &&
        !Object.values(TaskPriority).includes(priority)
    ) {
        errors.push({
            field: "priority",
            message: `Priority must be one of: ${Object.values(
                TaskPriority
            ).join(", ")}`
        });
    }

    if (
        dueDate !== undefined &&
        dueDate !== null &&
        Number.isNaN(Date.parse(dueDate))
    ) {
        errors.push({
            field: "dueDate",
            message: "Due date must be a valid date"
        });
    }

    if (errors.length > 0) {
        return next(createValidationError(errors));
    }

    next();
};

module.exports = {
    validateTaskId,
    validateCreateTask,
    validateUpdateTask
};
