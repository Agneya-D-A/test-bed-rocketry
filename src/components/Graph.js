import React, {useContext} from 'react';
import Chart from 'react-apexcharts';
import {GraphContext} from '../App';
import { generateDataArray, generateDataset } from '../util/datasets';

export default function Graph({purpose}){

    const {linkedList} = useContext(GraphContext);
    const options = {
        markers: {
            size: 1,
        },
        stroke: {
            curve: 'stepline',
        },
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          // eslint-disable-next-line react/prop-types
          categories: linkedList.length !== 0? linkedList.map((node)=>node.timeMilliSeconds) : []
        }
    };

    const series = [
        generateDataset(linkedList, purpose)
    ]

    return (
        <div className='graph'>
            <Chart options={options} series={series} width='300px' type='line'/>
        </div>
    )
}