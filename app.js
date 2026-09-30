const express = require("express");

const taskRoutes = require("./src/routes/taskRoutes");
const notFoundHandler = require("./src/middlewares/notFoundHandler");
const errorHandler = require("./src/middlewares/errorHandler");
const httpLogger = require("./src/middlewares/httpLogger");
const logger = require("./src/config/logger");

const app = express();
const PORT = 3000;

app.use(httpLogger);
app.use(express.json());
app.use("/api/tasks", taskRoutes);


app.get("/", (req, res) => {
    res.send("TaskFlow API is running");
});

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
    app.listen(PORT, () => {
        logger.info(
            { port: PORT },
            "TaskFlow API server started"
        );
    });
}
module.exports = app;

