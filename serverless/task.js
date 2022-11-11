const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app1 = express();
const app2 = express();


const TASKS_TABLE = 'taskdetails';
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app1.use(express.json());
app2.use(express.json());

app1.get("/tasks/:taskId", async function (req, res) {
  console.log('here')
  const params = {
    TableName: TASKS_TABLE,
    Key: {
      Task_ID: parseInt(req.params.taskId),
    },
  };
console.log(params);
  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      res.json(Item);
    } else {
      res
        .status(404)
        .json({ error: 'Could not find task with provided "taskId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive task" });
  }
});

app2.post("/tasks", async function (req, res) {
  const { taskId, name } = req.body;
  // if (typeof taskId !== "string") {
  //   res.status(400).json({ error: '"taskId" must be a string' });
  // } else if (typeof name !== "string") {
  //   res.status(400).json({ error: '"name" must be a string' });
  // }

  const params = {
    TableName: TASKS_TABLE,
    Item: {
      Task_ID: taskId,
      Task_Name: name,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ taskId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create task" });
  }
});

app1.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});
app2.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});
// app.listen(3000, () => {
//   console.log(`Listening: http://localhost:3000`);
//   console.log("Up and running task service");
// });
 module.exports.handler1 = serverless(app1);
 module.exports.handler2 = serverless(app2);
