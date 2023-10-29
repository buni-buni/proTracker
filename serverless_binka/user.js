const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
require("dotenv").config();

const app1 = express();
const app2 = express();

app1.use(cors())
app2.use(cors())

const TASKS_TABLE = 'taskdetailscopy';
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app1.use(express.json());
app2.use(express.json());

app1.get("/user/list/:taskName", async function (req, res) {
  console.log('here')
  const params = {
    TableName: TASKS_TABLE,
    Key: {
      taskName: req.params.taskName,
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
        .json({ error: 'Could not find task with provided name' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive task" });
  }
});

// app1.delete("/members/:memberId", (req, res) => {
//   const params = {
//     TableName: MEMBERS_TABLE,
//     Key: {
//       Member_ID: parseInt(req.params.memberId),
//     },
//   };
//   try{
//     const { Item } = dynamoDbClient.delete(params).promise();
//     res
//     .status(200)
//     .json(Item);
//   } catch(e){
//     res.status(500).json({ error: "Could not retreive member" });
//   }
// });


app1.post("/user/list/:taskName", async function (req, res) {
  if((!req.params.taskName) || (req.params?.taskName=='')){
    res.status(400).send({error:'Please enter task name'});
    return;
  }
  if((!req.body.description) || (req.body?.description=='')){
    res.status(400).send({error:'Please enter task description'});
    return;
  }
  if((!req.body.taskStartDate) || (req.body?.taskStartDate=='')){
    res.status(400).send({error:'Please enter task start date'});
    return;
  }
  if((!req.body.taskEndDate) || (req.body?.taskEndDate=='')){
    res.status(400).send({error:'Please enter task end date'});
    return;
  }
  if((!req.body.taskStatus) || (req.body?.taskStatus=='')){
    res.status(400).send({error:'Please enter task status'});
    return;
  }
  if((!req.body.taskEffort) || (req.body?.taskEffort=='')){
    res.status(400).send({error:'Please enter task effort'});
    return;
  }
  if(parseInt(req.body.taskEffort)<=0){
    res.status(400).send({error:'Task effort should be greater than 0'});
    return;
  }
  if(Date.parse(req.body.taskEndDate) < Date.parse(req.body.taskStartDate)) {
    res.status(400).send({error:'End date is less than start date'});
    return;
  }
  // req.body.taskId= Number(new Date());
  const params = {
    TableName: TASKS_TABLE,
    Item: req.body
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create task" });
  }
});

app1.put("/user/list/:taskName", async function (req, res) {
  
  if((!req.body.taskName) || (req.body?.taskName=='')){
    res.status(400).send({error:'Please enter task name'});
    return;
  }
  if((!req.body.description) || (req.body?.description=='')){
    res.status(400).send({error:'Please enter task description'});
    return;
  }
  if((!req.body.taskStartDate) || (req.body?.taskStartDate=='')){
    res.status(400).send({error:'Please enter task start date'});
    return;
  }
  if((!req.body.taskEndDate) || (req.body?.taskEndDate=='')){
    res.status(400).send({error:'Please enter task end date'});
    return;
  }
  if((!req.body.taskStatus) || (req.body?.taskStatus=='')){
    res.status(400).send({error:'Please enter task status'});
    return;
  }
  if((!req.body.taskEffort) || (req.body?.taskEffort=='')){
    res.status(400).send({error:'Please enter task effort'});
    return;
  }
  if(parseInt(req.body.taskEffort)<=0){
    res.status(400).send({error:'Task effort should be greater than 0'});
    return;
  }
  if(Date.parse(req.body.taskEndDate) <  Date.parse(req.body.taskStartDate)) {
    res.status(400).send({error:'End date is less than start date'});
    return;
  }
  // req.body.taskId = parseInt(req.body.taskId)
  const params = {
    TableName: TASKS_TABLE,
    Item: req.body
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not update task" });
  }
});


app2.get("/user/list", async (req, res) => {
  try {
    console.log('Inside get task list');
    const params = {
      TableName: TASKS_TABLE,
    };
    const  items  = await dynamoDbClient.scan(params).promise();
    console.log(items.Items);
    if (items.Items) {
      console.log('ir',items.Items);
      console.log(items.Items.sort((a, b) => b.taskEffort - a.taskEffort))
      res.json(items.Items.sort((a, b) => b.taskEffort - a.taskEffort));
    } else {
      res
        .status(404)
        .json({ error: 'Could not find task' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive task" });
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
//   console.log("Up and running member service");
// });
 module.exports.handler1 = serverless(app1);
 module.exports.handler2 = serverless(app2);
