import { useState, createContext, useEffect } from 'react'
import './App.css'
import Graph from './components/Graph'
import { LinkedList } from './util/LinkedList';
import {io} from 'socket.io-client';

const GraphContext = createContext();
const backendPort = 3001;
const backendUrl = `http://localhost:${backendPort}`;
const frontendUrl = 'http://localhost:3000'
const maxLength = 10;

export default function App() {
  const [linkedList, updateLinkedList] = useState(new LinkedList(maxLength));

  useEffect(()=>{
    let socket = io(`${backendUrl}`);
    socket.connect();
    socket.on('new_data',data =>{
      console.log(data);
      updateLinkedList(prevList => {
        const list = new LinkedList(maxLength);
        list.length = prevList.length;
        list.head = prevList.head;
        list.tail = prevList.tail
        list.shift(data);
        return list
      });

      return () =>{
        socket.disconnect();
      }
    })
    // const data = await JSON.parse(response.data);
  },[linkedList])

  return (
    <GraphContext.Provider value={{linkedList}}>
      {linkedList.length!==0 &&
      <div className='app'>
        <Graph purpose='chamberPressure'/>
        <Graph purpose='thrust'/>
      </div>}
    </GraphContext.Provider>
  )
}

export {GraphContext};