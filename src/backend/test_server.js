//Add this line to the package.json of the frontend
//"proxy":"http://localhost:3001"

const frontendPort = 3000;
const frontendAddress = `http://localhost:${frontendPort}`;
const backendPort = 3001;
let backendAddress = `http://localhost:${backendPort}`;
let serialPortPath = "COM8/USB/VID_2341&PID_0043/14011";
let baudRate = 9600;
let dbConnectionString = "mongodb://localhost:27017/static-fire-test"

//Imports
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

//Model
const {IncomingData} = require('../models/IncomingData');
const Note = require('../models/Note');

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
const sample = [[117200,0],[117200,410],[124100,420],[124100,420],[117200,420],[117200,420],[0,0]]
let i=0

//Handle Serial Data
const executionStartTime = new Date();

const handleData = async() =>{
    if(i>=7){
        clearInterval(intervalId);
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

let intervalId = setInterval(handleData,100);

io.on('connection',(socket)=>{
    console.log('Socket connection');

    socket.on('note_update',data=>{
        console.log(data);
        const updateNote = async ()=>{
            try{
                const note = await Note.findOne({note_id: data.note_id});
                note.note = data.note;
                await note.save();
            }
            catch(e){
                const note = new Note({
                    note_id: data.note_id,
                    note: data.note
                });

                await note.save();
            }
        }
        updateNote();
    });

    socket.on('config_update',data=>{
        console.log(data);
        serialPortPath = data.serialPortPath != null ? data.serialPortPath : serialPortPath;
        baudRate = data.baudRate != null? data.baudRate: baudRate;
        dbConnectionString = data.dbConnectionString != null? data.dbConnectionString : dbConnectionString;
        connectToDatabsase();
    });
})


//Listening on server
server.listen(backendPort,'localhost',() => {
    console.log(`Server listening on port ${backendPort}`);
});