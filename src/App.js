import { useState, createContext, useEffect, useRef } from 'react'
import './App.css'
import Graph from './components/Graph'
import { LinkedList } from './util/LinkedList';
import {io} from 'socket.io-client';
import Notes from './components/Notes';
import OptionsBar from './components/OptionsBar';

const GraphContext = createContext();
const backendPort = 3001;
const backendUrl = `http://localhost:${backendPort}`;
const frontendUrl = 'http://localhost:3000'
const maxLength = 10;

export default function App() {
  const [linkedList, updateLinkedList] = useState(new LinkedList(maxLength));
  const socket = useRef(null);

  useEffect(()=>{
    socket.current = io(backendUrl);
    socket.current.on('new_data',data =>{
      updateLinkedList(prevList => {
        const list = new LinkedList(maxLength);
        list.length = prevList.length;
        list.head = prevList.head;
        list.tail = prevList.tail
        list.shift(data);
        return list
      });
    })

    return () =>{
      if(socket.current)
      socket.current.disconnect();
    }
    // const data = await JSON.parse(response.data);
  },[])

  return (
    <GraphContext.Provider value={{linkedList, socket: socket.current}}>
       <div className='app'>
       {linkedList.length!==0 && <>    
        <Graph purpose='chamberPressure' color="#229945"/>
        <Graph purpose='thrust' color="#991133"/>
        <Notes/>
        </>}
        <OptionsBar/>
      </div>
    </GraphContext.Provider>
  )
}

export {GraphContext};