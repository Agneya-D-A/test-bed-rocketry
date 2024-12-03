//Add this line to the package.json of the frontend
//"proxy":"http://localhost:3001"

const frontendPort = 3000;
const frontendAddress = `http://localhost:${frontendPort}`;
const backendPort = 3001;;
const backendAddress = `http://localhost:${backendPort}`;
const serialPortPath = "COM8/USB/VID_2341&PID_0043/14011";
const baudRate = 9600;
const connection_string = "mongodb://localhost:27017/static-fire-test"

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
        await mongoose.connect(connection_string);
        console.log('Connected to MongoDB via Mongoose!');
    }
    catch(error){
        console.log('Error connecting to MongoDB:', error);
    }
  }
connectToDatabsase();

//Setup serial data reader
const {SerialPort, ReadLineParser} = require('serialport');
const port = new SerialPort({
path: serialPortPath,
baudRate: baudRate
});

const parser = port.pipe(new ReadLineParser({delimiter: '\r\n'}));

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

    io.emit('new-data',JSON.stringify(node));
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
})

//Listening on server
server.listen(backendPort, 'localhost',() => {
    console.log(`Server listening on port ${backendPort}`);
});