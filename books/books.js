const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

require("./memberdetails.model.js");
const MemberDetails = mongoose.model("memberdetails");
const url = process.env.MONGO_URL;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established with Book");
  })
  .catch((e) => {
    console.log("Connection failed",e);
  });

app.get("/", (req, res) => {
  res.send("This is books service");
});

app.post("/memberdetails", (req, res) => {
  console.log(req.body.Skillset.split(','));
  if(req.body.Total_Exp<4){
    res.status(400).send('Experience too low');
    return;
  }
  if(req.body.Skillset.split(',').length<3) {
    res.status(400).send('Skill do not match');
    return;
  }
  if(req.body.Project_start_date > req.body.Project_start_date) {
    res.status(400).send('End date is less than start date');
    return;
  }
  if(req.body.Allocation_percentage > 100) {
    res.status(400).send('Please enter allocation in %');
    return;
  }
  const memberdetails = new MemberDetails(req.body);
  memberdetails
    .save()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post("/memberdetails", (req, res) => {
  console.log(req.body.Skillset.split(','));
  if(req.body.Total_Exp<4){
    res.status(400).send('Experience too low');
    return;
  }
  if(req.body.Skillset.split(',').length<3) {
    res.status(400).send('Skill do not match');
    return;
  }
  if(req.body.Project_start_date > req.body.Project_start_date) {
    res.status(400).send('End date is less than start date');
    return;
  }
  if(req.body.Allocation_percentage > 100) {
    res.status(400).send('Please enter allocation in %');
    return;
  }
  const memberdetails = new MemberDetails(req.body);
  memberdetails
    .save()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/memberdetails", (req, res) => {
  MemberDetails.find().sort({Total_Exp: -1})
    .then((data) => {

  //     data=data.sort(function(x,y){return y["Total_Exp"]-x["Total_Exp"]});
  //  console.log("sorted data",data);
      //console.log(data,"data")
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/book/:id", (req, res) => {
  memberdetails.findById(req.params.id)
    .then((memberdetails) => {
      if (memberdetails) {
        res.status(200).send(memberdetails);
      } else {
        res.status(404).send("No such book found");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.delete("/book/:id", (req, res) => {
  memberdetails.findByIdAndDelete(req.params.id)
    .then((memberdetails) => {
      if (memberdetails) {
        res.status(200).send(memberdetails);
      } else {
        res.status(404).send("No book found");
      }
    })
    .catch((err) => res.status(400).send(err));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
  console.log("Up and running books service");
});
