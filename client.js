var PROTO_PATH = "../../eclipse-workspace/grpc/src/main/proto/HelloService.proto";

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
const { resolve } = require('path');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var helloservice = protoDescriptor.com.practice.grpc;

var stub = new helloservice.HelloService('localhost:8080', grpc.credentials.createInsecure());

var params = {
    firstName:"Vincent",
    lastName:"Falardeau"
};

/**
 * Hello world (simple)
 */
stub.hello(params, function(err, response){
    console.log(response.greeting);
});


/**
 * Friend list (server streaming)
 */
var call = stub.getFriendList("Send my the friend list");

//Called for every feature (friend) that is sent by the server
call.on('data', function(friend) {
    console.log(friend);
});
call.on('end', function() {
  // The server has finished sending
});
call.on('error', function(e) {
  // An error has occurred and the stream has been closed.
});
call.on('status', function(status) {
  // process status
});



/**
 * Restaurant order (client streaming)
 */
var call = stub.restaurantOrder(function(error, response){
    //Called when the communication is over, just displays the order string
    console.log(response);
});
//console.log(call);

//Synchronous
// call.write({name:"chicken", amount:2});
// call.write({name:"sauce", amount:4});
// call.end();

//Asynchronous (chained promises)
new Promise(function(resolve, reject) {

    setTimeout(() => {
        call.write({name:"chicken", amount:2});
        resolve();
    }, 1000);
  
}).then(function(result) {

    new Promise(function(resolve, reject) {

        setTimeout(() => {
            call.write({name:"sauce", amount:4});
            resolve();
        }, 500);
      
    }).then(function(result){
        call.end();
        resolve();
    })    
  
});


/**
 * Parrot (bidirectionnal streaming)
 */
var parrotCall = stub.parrot();

new Promise(function(resolve, reject) {

    setTimeout(() => {
        parrotCall.write({message:"Hello parrot, how are you?"});
        resolve();
    }, 1000);
  
}).then(function(result) {

    new Promise(function(resolve, reject) {

        setTimeout(() => {
            parrotCall.write({message:"Bye parrot!"});
            resolve();
        }, 500);
      
    }).then(function(result){
        parrotCall.end();
        resolve();
    })    
  
});

//When the parrot repeats
parrotCall.on('data', function(response) {
    console.log(response);
});

parrotCall.on('end', function(response) {
    //Do nothing here
});

parrotCall.on('error', function(e) {
  // An error has occurred and the stream has been closed.
});
parrotCall.on('status', function(status) {
  // process status
});

/**
 * Parrot (bidirectionnal streaming) with user input
 */
var parrotCall2 = stub.parrot();

//Simulate user input
var userInputs = ["Hello!", "How are you?", "Bye!"];
var i = 0;

//Takes the next input
function nextInput(){

    //Make sure there are still inputs to be given
    if(i == userInputs.length){
        
        //If not, end communication
        parrotCall2.end();
        return;
    }

    //Wait for the input
    new Promise((resolve) => {

        setTimeout(() => {

            //When receiving the input, send it to the server
            parrotCall2.write({message:userInputs[i]});
            
            resolve();
        }, 500);
      
    }).then(() => {

        //And then wait for the next one
        i++;
        nextInput();
    })    
}

//When the parrot repeats
parrotCall2.on('data', function(response) {
    console.log(response);
});

parrotCall2.on('end', function(response) {
    //Do nothing here
});

parrotCall2.on('error', function(e) {
    console.log(e);
  // An error has occurred and the stream has been closed.
});
parrotCall2.on('status', function(status) {
  // process status
});

nextInput();




