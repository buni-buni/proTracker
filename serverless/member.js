const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
require("dotenv").config();

const app1 = express();
const app2 = express();


const MEMBERS_TABLE = 'memberdetails';
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app1.use(express.json());
app2.use(express.json());

app1.get("/members/:memberId", async function (req, res) {
  console.log('here')
  const params = {
    TableName: MEMBERS_TABLE,
    Key: {
      Member_ID: parseInt(req.params.memberId),
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
        .json({ error: 'Could not find member with provided "memberId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive member" });
  }
});

app2.post("/members", async function (req, res) {
  const { memberId, name } = req.body;
  // if (typeof memberId !== "string") {
  //   res.status(400).json({ error: '"memberId" must be a string' });
  // } else if (typeof name !== "string") {
  //   res.status(400).json({ error: '"name" must be a string' });
  // }

  const params = {
    TableName: MEMBERS_TABLE,
    Item: {
      Member_ID: memberId,
      Member_Name: name,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ memberId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create member" });
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
