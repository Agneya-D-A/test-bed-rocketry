import React, { useContext, useState } from 'react';
import './OptionsBar.css';
import { GraphContext} from '../App';

export default function OptionsBar(){

    const {socket} = useContext(GraphContext);

    const [options, setOptions] = useState({
        SerialPortPath: '',
        dbConnectionString: '',
        baudRate : ''
    });

    const handleOptionsSubmit = (e) =>{
        e.preventDefault();
        socket.emit('config_update', options);
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setOptions(prevOptions => {
            return {
                ...prevOptions,
                [name]: value
            }
        });
    }



    return (
        <div className='options-bar' onSubmit={handleOptionsSubmit}>
            <form className='options-form'>
                <label htmlFor='serialPortPath'>Serial Port Path</label>
                <label htmlFor='dbConnectionString'>Database Connection String</label>
                <label htmlFor='baudRate'>Baud Rate</label>
                <input type='text' name='serialPortPath' id='serialPortPath' value={options.SerialPortPath} onChange={handleChange}/>
                <input type='text' name='dbConnectionString' id='dbConnectionString' value={options.dbConnectionString} onChange={handleChange}/>
                <input type='number' name='baudRate' id='baudRate' value={options.baudRate} onChange={handleChange}/>
                <button className='optionsSubmit'>Set config</button>
            </form>
        </div>
    );
}