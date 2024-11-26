const generateDataArray = (linkedList, purpose) =>{
    let arr;
    switch(purpose){
        case 'chamberPressure':
            arr = linkedList.map((node)=>node.chamberPressure);
            break;
        case 'thrust':
            arr = linkedList.map((node)=>node.thrust);
            break;
        default:
            arr = [];
    }
    return arr;
}

const generateDataset = (linkedList,purpose,color='#990022') =>{
    const template = {
        type: 'line',
        name: '',
        // data: [30, 40, 45, 50, 49, 60, 70, 91],
        data: linkedList.length !== 0? generateDataArray(linkedList, purpose) : [],
        color: color
    }

    let object;

    switch(purpose){
        case 'chamberPressure':
            object = {...template, name: 'Chamber Pressure (Pa)'};
            break;
        case 'thrust':
            object = {...template, name: 'Thrust (N)'};
            break;
        default:
            object = {...template, name: 'You forgot to put name here mate'}
    }

    return object;
}

export {generateDataArray, generateDataset};