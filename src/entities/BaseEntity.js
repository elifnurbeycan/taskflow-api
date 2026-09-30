class BaseEntity {
    constructor(id) {
        this.id = id;
        this.createdAt = new Date();
        this.createdBy = null;
        this.updatedAt = null;
        this.updatedBy = null;
        this.version = 1;
        this.active = true;
    }
}

module.exports = BaseEntity;