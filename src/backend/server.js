//Add this line to the package.json of the frontend
//"proxy":"http://localhost:3001"

const frontendPort = 3000;
const frontendAddress = `http://localhost:${frontendPort}`;
const backendPort = 3001;;
let backendAddress = `http://localhost:${backendPort}`;
let serialPortPath = "COM5/USB/VID_1A86&PID_7523/6&22A3D4F&0&2";
let baudRate = 9600;
let dbConnectionString = "mongodb://localhost:27017/static-fire-test"

//Imports
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//Model
const {IncomingData} = require('../models/IncomingData');
const {Note} = require('../models/Note');

//Setup server
const app = express();
app.use(cors());
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
    try {
        await mongoose.connect(dbConnectionString);
        console.log('Connected to MongoDB via Mongoose!');
    }
    catch(error){
        console.log('Error connecting to MongoDB:', error);
    }
  }
connectToDatabsase();

//Setup serial data reader
const {SerialPort, ReadlineParser} = require('serialport');
// const { ReadlineParser } = require('@serialport/parser-readline');


const port = new SerialPort({
    path: serialPortPath,
    baudRate: baudRate
});
    
let parser = port.pipe(new ReadlineParser({delimiter: '\r\n'}));

port.on('open', () => {
console.log('Serial port opened');
});

//Handle Serial Data
parser.on('data',(data)=>{
    const stringArray = data.split(",");
    let serialArray = stringArray.map((value)=>parseFloat(value));
    handleSerialData(serialArray);
})

const executionStartTime = new Date();

const handleSerialData = async (serialArray) =>{
    const time = new Date();
    const timeMilliSeconds = time.getTime() - executionStartTime.getTime();
    const node = {
        timeStamp: time,
        timeMilliSeconds: timeMilliSeconds,
        thrust: serialArray[0],
        chamberPressure: serialArray[1]
    }

    io.emit('new-data',{...node});
    const newDocument = new IncomingData(node);
    await newDocument.save();
    console.log(node);
}

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

    // socket.on('config_update',data=>{
    //     console.log(data);
    //     serialPortPath = data.serialPortPath != null ? data.serialPortPath : serialPortPath;
    //     baudRate = data.baudRate != null? data.baudRate: baudRate;
    //     dbConnectionString = data.dbConnectionString != null? data.dbConnectionString : dbConnectionString;
    //     connectToDatabsase();
    //     setPort();
    // });
})

//Listening on server
server.listen(backendPort, 'localhost',() => {
    console.log(`Server listening on port ${backendPort}`);
});