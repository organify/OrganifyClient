var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing movies into DynamoDB. Please wait.");

var allMovies = JSON.parse(fs.readFileSync('septemberData.json', 'utf8'));
allMovies.forEach(function(params) {

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add item", params.Item.productId, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", params.Item.productId);
       }
    });
});
