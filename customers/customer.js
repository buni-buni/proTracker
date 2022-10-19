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
var request=require('request');

require("./customer.model.js");
const Customer = mongoose.model("taskDetails");
const url = process.env.MONGO_URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established with CustomerService");
  })
  .catch((e) => {
    console.log("Connection failed",e);
  });
//   var memberIdDetails=[];
// //console.log(memberIdDetails,"memberIdDetails")
   let options = {};
//   var idList=[];

 //console.log("typeof(arr1),",typeof(memberIdDetails));
//   memberIdDetails=request.get('http://localhost:3000/memberdetails',options,function(err,res,body){
//   //console.log("X",res.body)
//   // for(key of JSON.parse(res.body)){
//   //  //console.log(key,"key");
//   //   //console.log(res.body[key],"key")
//   //   idList.push(key.Member_ID)
//   // }
//  //console.log("idList",JSON.parse(res.body))
//   return JSON.parse(res.body);
// });

app.get("/", (req, res) => {
  res.send("This is customer service");
});

 app.post("/taskDetails", async function (req, res)  {

  request.get('http://localhost:3000/memberdetails',options, await function(err,resps,body){
    console.log("p1");
    
    
    //try{
      //console.log("oooo",req.body)
       var arr1= (req.body);
    /// console.log("pppp",(resps.body),"sddddddddddd")
    
        let result = JSON.parse(resps.body).filter(o1 => !arr1.some(o2 => o1.Member_ID === o2.Member_ID)); 
       console.log(result) ;
       if(result.length>0){
        res.send("Member Id missng");
        return;
       }else {
        req.body.forEach(function(obj) {
          var customer = new Customer(obj);
          //console.log("obj",obj)
          customer.save();  
         // customer.save();
        });
        res.send("Success");

       }

      
    
    });
 // console.log(JSON.parse(req.body),"hashajshjash")

 
//}
// catch(err) {
//      res.send("Member id doent exist");
//    }



//console.log("rb",req.body)

  // const customer = new Customer(req.body);
  // console.log(customer,"cusi",req.body)
  // for(keys of JSON.parse(req.body)){
  //    custId.push(keys.Member_ID)
  //  }
  
  //  console.log("Ddd",custId);
  // if(false){

  //   res.send(" bbbbbbbbbbbbbbbbbbbbbbbbbb");
  // }else{
  // customer
  //   .save()
  //   .then((data) => {
  //     if (data) {
  //       res.status(200).send(data);
  //     } else {
  //       res.status(400).send("Something went wrong");
  //     }
  //   })
  //   .catch((err) => {
  //     res.send(err.message);
  //   })
  // };
});

app.get("/taskDetails", (req, res) => {
  Customer.find()
    .then((customers) => {
      if (customers) {
        res.status(200).send(customers);
      } else {
        res.status(404).send("No customers found");
      }
    })
    .catch((err) => res.send(err.message));
});

// app.get("/customer/:id", (req, res) => {
//   Customer.findById(req.params.id)
//     .then((customer) => {
//       if (customer) {
//         res.status(200).send(customer);
//       } else {
//         res.status(404).send("No customer found");
//       }
//     })
//     .catch((err) => res.send(err.message));
// });

app.delete("/taskDetails/", (req, res) => {
    Customer.remove({}, function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
       // app.close();
       res.send("chup")
    });
});
  


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
  console.log("Up and running customer service");
});
