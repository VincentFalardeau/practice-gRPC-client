var PROTO_PATH = "../../eclipse-workspace/grpc/src/main/proto/HelloService.proto";

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');

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

function main(){

   

   let stub = new helloservice.HelloService('localhost:8080', grpc.credentials.createInsecure());

    let params = {
        firstName:"Vincent",
        lastName:"Falardeau"
    };

    stub.hello(params, function(err, response){
        console.log(response.greeting);
    });
}

main();