//Add this line to the package.json of the frontend
//"proxy":"http://localhost:3001"

const frontendPort = 3000;
const frontendAddress = `http://localhost:${frontendPort}`;
const backendPort = 3001;
const backendAddress = `http://localhost:${backendPort}`;
const serialPortPath = "COM8/USB/VID_2341&PID_0043/14011";
const baudRate = 9600;
const dbConnectionString = "mongodb://localhost:27017/static-fire-test"

//Imports
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

//Model
const {IncomingData} = require('../models/IncomingData');

//Setup server
const app = express();
app.use(cors());

// app.options('*',cors());
const server = http.createServer(app);

//Socket.io setup
const io = require('socket.io')(server,{
    cors: {
        origin: frontendAddress,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Access-Control-Allow-Origin'],
        credentials: true
    }
});

//Setup MongoDB

const connectToDatabsase = async () =>{
    let connection_string = dbConnectionString;
    try {
        await mongoose.connect(connection_string);
        console.log('Connected to MongoDB via Mongoose!');
    }
    catch(error){
        console.log('Error connecting to MongoDB:', error);
    }
  }
connectToDatabsase();

//Test Array
const sample = [[1,2],[4,2],[3,6],[5,10],[8,11],[-3,-1]]
let i=0

//Handle Serial Data
const executionStartTime = new Date();

const handleData = async() =>{
    if(i>=6){
        clearInterval(handleData);
        i = 0;
        return;
    }
    const serialArray = sample[i];
    const time = new Date();
    const timeMilliSeconds = time.getTime() - executionStartTime.getTime();
    const node = {
        timeStamp: time,
        timeMilliSeconds: timeMilliSeconds,
        thrust: serialArray[0],
        chamberPressure: serialArray[1]
    }
    const newDocument = new IncomingData(node);
    await newDocument.save();
    console.log(node);
    i++;
    io.emit('new_data',{...node});
}  

setInterval(handleData,3000);


//Listening on server
server.listen(backendPort,'localhost',() => {
    console.log(`Server listening on port ${backendPort}`);
});