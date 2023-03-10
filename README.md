# Dialogflow_to_bigquery
Storing the conversation logs into bigquery using NodeJS

We have two ways to store conversation logs into bigquery from dialogflow. One is using dialogflow Inline editor(Cloud Functions) and other is uing webhooks.
Now we are using webhooks way to store the logs.

Prerequisites:
1.NodeJS
2.GCP account in which bigquery table is created in a project.

Steps:
1.Create a service account in GCP for getting access to Bigquery.
2.Download the Index.js file and Package.json from this repo
3.Now place the key of service account in the same folder where Index.js and package.json is located
4.Now run npm i for installing all dependencies
5.Check for all the commented lines and give the credentials where ever required inside the Index.js file.
6.Now we need to host this program and take the https URL after hosting it as a service. (We can use App Engine in GCP, heroku etc).
  (For testing purpose we can use ngrok, localtunnel etc.)


