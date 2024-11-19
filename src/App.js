import { useState, createContext, useEffect } from 'react'
import './App.css'
import Graph from './components/Graph'
import axios from 'axios'
import { LinkedList } from './util/LinkedList';
import {io, Socket} from 'socket.io-client';

const GraphContext = createContext();
const backendPort = 3001;
const backendUrl = `http://localhost/${backendPort}`;
const frontendUrl = 'http://localhost/5173'
const maxLength = 10;

export default function App() {
  const [linkedList, updateLinkedList] = useState(new LinkedList(maxLength));

  useEffect(()=>{
    async function getData(){
    let socket = io(backendUrl);
    socket.connect();
    socket.on('new_data',data =>{
      console.log(data);
      updateLinkedList(prevList => {
        const list = new LinkedList(maxLength);
        list.length = prevList.length;
        list.head = prevList.head;
        this.tail = prevList.tail
        list.shift(JSON.parse(data));
        return list
      });

      return () =>{
        socket.disconnect();
      }
    })
    // const data = await JSON.parse(response.data);
    
    }
    getData();
  },[linkedList])

  return (
    <GraphContext.Provider value={{linkedList}}>
      {linkedList.length!=0 &&
      <div className='app'>
        <Graph purpose='chamberPressure'/>
        <Graph purpose='thrust'/>
      </div>}
    </GraphContext.Provider>
  )
}

module.exports = {GraphContext};