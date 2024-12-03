import React, {useContext} from 'react';
import Chart from 'react-apexcharts';
import {GraphContext} from '../App'
import './Graph.css';
import { generateDataArray, generateDataset } from '../util/datasets';

export default function Graph({purpose, color}){

    const {linkedList} = useContext(GraphContext);
    const timeArray = linkedList.length > 0? linkedList.map((node)=>node.timeMilliSeconds) : ['failed'];
    const options = {
        markers: {
            size: 2,
        },
        // height: '350px',
        stroke: {
            curve: 'smooth',
        },   
        // chart: {
        //   id: "basic-bar"
        // },
        chart: {
            height: 950,
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.5
            },
        },
        datalabels: {
            enabled: true
        },
        xaxis: {
            type: 'category',
            categories: timeArray,
            title: {
                text: 'time (ms)'
            }
        },

        yaxis: {
            title: {
                text: purpose === 'chamberPressure'? 'Chamber Pressure (Pa)': 'Thrust (N)'
            }
        }
    };

    const series = [
        {...generateDataset(linkedList, purpose, color)}
    ]

    return (
        <div className='graph'>
            <Chart key={JSON.stringify(series)} options={options} series={series} height='400px' width='600px' type='line'/>
        </div>
    )
}