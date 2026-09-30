process.env.NODE_ENV = "test";

const {
    test,
    before,
    after,
    beforeEach
} = require("node:test");
const assert = require("node:assert/strict");

const app = require("../app");
const tasks = require("../src/data/tasks");

let server;
let baseUrl;

before(async () => {
    await new Promise(resolve => {
        server = app.listen(0, "127.0.0.1", () => {
            const address = server.address();
            baseUrl = `http://127.0.0.1:${address.port}`;
            resolve();
        });
    });
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close(error => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
});

beforeEach(() => {
    tasks.length = 0;
});

const request = async (method, path, body) => {
    const options = {
        method,
        headers: {}
    };

    if (body !== undefined) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${path}`, options);
    const responseBody = await response.json();

    return {
        status: response.status,
        body: responseBody
    };
};

const createValidTask = () => {
    return request("POST", "/api/tasks", {
        title: "Backend geliştirme",
        description: "Task API testlerini yaz",
        projectId: 1,
        assignee: "Elif Beycan",
        priority: "HIGH",
        dueDate: "2026-10-15"
    });
};

test("POST /api/tasks creates a task", async () => {
    const response = await createValidTask();

    assert.equal(response.status, 201);
    assert.equal(response.body.id, 1);
    assert.equal(response.body.title, "Backend geliştirme");
    assert.equal(response.body.assignee, "Elif Beycan");
    assert.equal(response.body.status, "PENDING");
    assert.equal(response.body.priority, "HIGH");
    assert.equal(response.body.active, true);
});

test("GET /api/tasks returns active tasks", async () => {
    await createValidTask();

    const response = await request("GET", "/api/tasks");

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].id, 1);
});

test("PUT /api/tasks/:id updates a task", async () => {
    await createValidTask();

    const response = await request("PUT", "/api/tasks/1", {
        title: "Backend tamamlanıyor",
        assignee: "Musa",
        status: "IN_PROGRESS",
        priority: "MEDIUM"
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.title, "Backend tamamlanıyor");
    assert.equal(response.body.assignee, "Musa");
    assert.equal(response.body.status, "IN_PROGRESS");
    assert.equal(response.body.priority, "MEDIUM");
    assert.equal(response.body.version, 2);
    assert.ok(response.body.updatedAt);
});

test("DELETE /api/tasks/:id soft deletes a task", async () => {
    await createValidTask();

    const deleteResponse = await request(
        "DELETE",
        "/api/tasks/1"
    );

    assert.equal(deleteResponse.status, 200);
    assert.equal(
        deleteResponse.body.message,
        "Task deleted successfully"
    );

    const getResponse = await request("GET", "/api/tasks/1");

    assert.equal(getResponse.status, 404);
    assert.equal(
        getResponse.body.error.code,
        "TASK_NOT_FOUND"
    );
});

test("POST /api/tasks rejects invalid fields", async () => {
    const response = await request("POST", "/api/tasks", {
        title: "",
        projectId: -1,
        assignee: "",
        priority: "SUPER_HIGH",
        dueDate: "yanlis-tarih"
    });

    assert.equal(response.status, 400);
    assert.equal(
        response.body.error.code,
        "VALIDATION_ERROR"
    );
    assert.equal(response.body.error.details.length, 5);
});

test("GET /api/tasks/:id rejects an invalid id", async () => {
    const response = await request(
        "GET",
        "/api/tasks/abc"
    );

    assert.equal(response.status, 400);
    assert.equal(
        response.body.error.code,
        "VALIDATION_ERROR"
    );
    assert.equal(
        response.body.error.details[0].field,
        "id"
    );
});

test("unknown routes return ROUTE_NOT_FOUND", async () => {
    const response = await request("GET", "/api/deneme");

    assert.equal(response.status, 404);
    assert.equal(
        response.body.error.code,
        "ROUTE_NOT_FOUND"
    );
});