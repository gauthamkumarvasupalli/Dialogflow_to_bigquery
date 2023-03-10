//Install  the following requirements
const express = require('express');
const path = require('path');
const {WebhookClient} = require('dialogflow-fulfillment');
const bodyparser = require('body-parser')
const request = require('request');
const app = express();
const {BigQuery} = require('@google-cloud/bigquery');

// Enter these details
let projectId=" ";
let datasetId=' ';// Can be seen in bigquery
let tableId=' ';// Can be seen in bigquery

//Service account
const options = {
  keyFilename: './ ', // give the path for Service account
  projectId: projectId,
  location: 'US',//Give the location of your project. Here I am using "US"
};

const bigqueryClient= new BigQuery(options);
//to change the response into json format
app.use(bodyparser.json());

//for checking app is working or not
app.get('/', (req, res) => {
  res.send('It is working fine');
})


//webhooks connectivity
app.post("/webhooks", (req, res) => 
  {
    (async () => {
      
      // It contains the fullfilment request. gk variable will have the all data we needed. You can check the fullfilment request structure in Dialogflow documentation.
      gk=req.body;
      
      // for adding the time stamp
      const d = new Date();
      let text = d.toString();
      var a=text.split(" ");
      var c=a[2]+"-"+a[1]+"-"+a[3];
      sess=gk["session"].split("/");
      time_out=sess[4].split("-");
      
      //try block where we try to store the conversation
        try {
         const rows=[{
          Message: gk["queryResult"]["queryText"], //user message
          Session_Id: sess[4], 
          Response_Id: gk["responseId"], 
          Intent_name: gk["queryResult"]["intent"]["displayName"], 
          Language: gk["queryResult"]["languageCode"], 
          Response: gk["queryResult"]["fulfillmentMessages"][0]["payload"]["message"],
          Intent_confidence:gk["queryResult"]["intentDetectionConfidence"],
          Date: d
          }];
          await bigqueryClient
          .dataset(datasetId)
          .table(tableId)
          .insert(rows)
          .then(() => {
              console.log(`Inserted ${rows.length} rows`);
          });
    
          console.log(gk["queryResult"]["intent"]["displayName"]);  // It will give Intent name in logs which can be considered as Intent is stored in Bigquery     
          return res.status(200).send();
        } catch (error) {
          console.log(error);// If storing is failed in Bigquery, then it will give error here.
          return res.status(500).send(error);
        }
      })();
  });


console.log("Compiled succcesfully")
app.listen(process.env.PORT || 8000);




