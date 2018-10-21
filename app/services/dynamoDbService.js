var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "organifyProduct";

var getItemByProductId = function (id, callBack) {

    var params = {
        TableName: table,
        Key: {
            "productId": id
        }
    };

    docClient.get(params, callBack);
}

var addEvent = function (id, event, callBack) {
    var params = {
        TableName: table,
        Key: {
            "productId": id
        },
        UpdateExpression: "SET #ri = list_append(:vals, #ri)",
        ExpressionAttributeNames: {"#ri": "events"},
        ExpressionAttributeValues: {":vals": [event]},
        ReturnValues: "UPDATED_NEW"
    };

    console.log("Updating the item...");
    docClient.update(params, callBack);
}
module.exports = {
    get: getItemByProductId,
    addEvent: addEvent
}