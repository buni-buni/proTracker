const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
require("dotenv").config();

const app1 = express();
const app2 = express();

app1.use(cors())
app2.use(cors())

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

app1.delete("/members/:memberId", (req, res) => {
  const params = {
    TableName: MEMBERS_TABLE,
    Key: {
      Member_ID: parseInt(req.params.memberId),
    },
  };
  try{
    const { Item } = dynamoDbClient.delete(params).promise();
    res
    .status(200)
    .json(Item);
  } catch(e){
    res.status(500).json({ error: "Could not retreive member" });
  }
});

app2.get("/members", async (req, res) => {
  try {
    console.log('Inside get member list');
    const params = {
      TableName: MEMBERS_TABLE,
    };
    const  items  = await dynamoDbClient.scan(params).promise();
    console.log(items.Items);
    if (items.Items) {
      console.log('ir',items.Items);
      console.log(items.Items.sort((a, b) => b.Total_Exp - a.Total_Exp))
      res.json(items.Items.sort((a, b) => b.Total_Exp - a.Total_Exp));
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
  console.log(req.body.Skillset.split(','));
  if(req.body.Total_Exp<4){
    res.status(400).send({error:'Experience too low'});
    return;
  }
  if(req.body.Skillset.split(',').length<3) {
    res.status(400).send({error:'Skill do not match'});
    return;
  }
  if(req.body.Project_start_date > req.body.Project_start_date) {
    res.status(400).send({error:'End date is less than start date'});
    return;
  }
  if(req.body.Allocation_percentage > 100) {
    res.status(400).send({error:'Please enter allocation in %'});
    return;
  }
  req.body.Member_ID= Number(new Date());
  const params = {
    TableName: MEMBERS_TABLE,
    Item: req.body
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create member" });
  }
});

app2.put("/members", async function (req, res) {
  console.log(req.body.Skillset.split(','));
  if(req.body.Total_Exp<4){
    res.status(400).send({error:'Experience too low'});
    return;
  }
  if(req.body.Skillset.split(',').length<3) {
    res.status(400).send({error:'Skill do not match'});
    return;
  }
  if(req.body.Project_start_date > req.body.Project_start_date) {
    res.status(400).send({error:'End date is less than start date'});
    return;
  }
  if(req.body.Allocation_percentage > 100) {
    res.status(400).send({error:'Please enter allocation in %'});
    return;
  }
  let today = new Date();
  let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  if(req.body.Project_end_date < date && req.body.Allocation_percentage!=0) {
    res.status(400).send({error:'If project end date is lesser than the current date, then the allocation percentage must be updated as 0.'});
    return;
  }
  
  if(req.body.Project_end_date > date && req.body.Allocation_percentage!=100) {
    res.status(400).send({error:'If the project end date is greater than the current date, then the allocation percentage must be 100%'});
    return;
  }
  req.body.Member_ID = parseInt(req.body.Member_ID)
  const params = {
    TableName: MEMBERS_TABLE,
    Item: req.body
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json(req.body);
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
