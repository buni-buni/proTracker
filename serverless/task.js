const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

var request=require('request');

const app1 = express();
const app2 = express();

app1.use(cors())
app2.use(cors())

const TASKS_TABLE = 'taskdetails';
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app1.use(express.json());
app2.use(express.json());

app1.get("/tasks/:MemberId", async function (req, res) {
  console.log('here')
  let params = {
    TableName: TASKS_TABLE,
    Key: {
      Member_ID: parseInt(req.params.MemberId),
    },
  };
console.log(params);
  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    console.log('Item',Item);

    request.get(`https://cda6yduyd7.execute-api.us-east-1.amazonaws.com/members/${parseInt(req.params.MemberId)}`, async function(err,resps,body){
        
      let result = JSON.parse(resps.body)   
      console.log('result',result);

     let Item3 = Object.assign({}, result, Item);
     console.log('Item3',Item3);
 
     if (Item3) {
       res.json(Item3);
     } else {
       res
         .status(404)
         .json({ error: 'Could not find task with provided memberID' });
     }

  });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive task" });
  }
});

app2.post("/tasks", async function (req, res) {
  const params = {
    TableName: TASKS_TABLE,
    Item: req.body,
  };

  request.get('https://cda6yduyd7.execute-api.us-east-1.amazonaws.com/members', async function(err,resps,body){
        
        let result = JSON.parse(resps.body).filter(o1 => o1.Member_ID === req.body.Member_ID); 
       console.log("rest",result.length) ;
       if(result.length < 0) {
        res.send("Member Id is missing unable to insert task");
        return;
       }
       if(req.body.Task_End_Date < result.Project_end_date){
        res.status(400).json({ error: "Task end date should be greater than project end date" });
       }
       if(req.body.Task_End_Date < req.body.Task_Start_Date){
        res.status(400).json({ error: "Task end date should be greater than task start date" });
       }
       
      try {
        await dynamoDbClient.put(params).promise();
        res.json(resps.body);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not create task" });
      }

    });

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
