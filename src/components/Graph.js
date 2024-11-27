import React, {useContext} from 'react';
import Chart from 'react-apexcharts';
import {GraphContext} from '../App'
import { generateDataArray, generateDataset } from '../util/datasets';

export default function Graph({purpose, color}){

    const {linkedList} = useContext(GraphContext);
    const timeArray = linkedList.length > 0? linkedList.map((node)=>node.timeMilliSeconds) : ['failed'];
    const options = {
        markers: {
            size: 2,
        },
        // stroke: {
        //     curve: 'none',
        // },   
        // chart: {
        //   id: "basic-bar"
        // },
        xaxis: {
            type: 'category',
            categories: timeArray
        }
    };

    const series = [
        {...generateDataset(linkedList, purpose, color)}
    ]

    return (
        <div className='graph'>
            <Chart key={JSON.stringify(series)} options={options} series={series} width='300px' type='line'/>
        </div>
    )
}