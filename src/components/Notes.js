import React, { useRef, useState, useContext} from "react";
import { GraphContext } from "../App";
import { v4 as uuidv4 } from 'uuid'; 

export default function Notes(){
    const [noteBody, setNoteBody] = useState("");
    const {socket} = useContext(GraphContext);

    const ref = useRef({
        note_id : uuidv4(),
        note: ""
    });

    function handleChange(e){
        const {name, value} = e.target;
        setNoteBody(value);
    }

    function handleSubmit(e){
        e.preventDefault();
        ref.current.note = noteBody;
        console.log(ref.current.note);
        
        console.log(socket);
        socket.emit('note_update',{note_id: ref.current.note_id, note: ref.current.note});
        // socket.disconnect();
    }

    return (
        <form className="noteForm" onSubmit={handleSubmit}>
            <textarea value={noteBody} name="note" onChange={handleChange}></textarea>
            <button type="submit">Submit</button>
        </form>
    )
}