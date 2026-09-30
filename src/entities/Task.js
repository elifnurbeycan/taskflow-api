const BaseEntity = require("./BaseEntity");
const TaskStatus = require("../enums/taskStatus");
const TaskPriority = require("../enums/taskPriority");

class Task extends BaseEntity {

    constructor(id, title, description, projectId, assignee, priority, dueDate) {
        super(id);

        this.title = title;
        this.description = description;
        this.projectId = projectId;
        this.assignee = assignee;

        this.status = TaskStatus.PENDING;
        this.priority = priority || TaskPriority.MEDIUM;

        this.dueDate = dueDate;
    }
}

module.exports = Task;
