import React, {useState, useEffect} from 'react';
import initialData from './initialData';
import './App.css';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';


const getListStyle = (isDraggingOver) => {
    return{
        background: isDraggingOver ? "red" : null,
        padding: 8,
        width: 250
    }
};

const App = () => {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        setColumns(initialData[0]);
        let rows = initialData[1].map((row, i)=> {
            let obj = row;
            let num = i + 1;
            obj.id = num.toString();
            obj.isDragDisable = false;
            return obj;
        })
        setRows(rows)
    }, []);

    useEffect(() => {
        console.log(rows);
    }, [rows]);

    let lastClicked = [];
    
    const reorder = (startIndex, endIndex) => {
        let result = Array.from(rows);
        let draggedElement = [];
        let lastElement = result[endIndex];
        if(lastClicked.length){
            lastClicked.forEach((id) => {
                let index = result.findIndex((item) => `draggableRow${item.id}` === id);
                let [remove] = result.splice(index, 1);
                let row = {...remove, isDragDisable: true};
                draggedElement.push(row);
            });
            let lastIndex = result.findIndex((item) => item.id === lastElement.id);
            
            for(let i=0; i< draggedElement.length; i++){
                let index = lastIndex + i;
                result.splice(index, 0, draggedElement[i]);
            }
            lastClicked = [];
        }else{
            const [remove] = result.splice(startIndex, 1);
            let row = {...remove, isDragDisable: true};
            result.splice(endIndex, 0, row);
        }
        return result;
    }

    const onDragEnd = (event) => {
        if(!event.destination){
            return;
        }
        if(event.source.index === event.destination.index){
            return;
        }
        const reorderedItems = reorder(event.source.index, event.destination.index);
        let rowId = event.draggableId;
        let element = document.getElementById(`draggableRow${rowId}`);
        if(element.classList.contains("selected")){
            let parent = document.querySelector("[data-rbd-droppable-id]");
            parent.childNodes.forEach((node) => {
                if(node.classList.contains("selected")){
                    node.classList.remove('selected');
                    node.classList.add('drged');
                }
            });
        }else{
            element.classList.remove('selected');
            element.classList.add('drged');
        }
        setRows(reorderedItems);
    }

    const onDragStart = (event) => {
        // let parent = document.querySelector("[data-rbd-droppable-id]");
        // parent.childNodes.forEach((node) => {
        //     if(node.classList.contains("drged")){
        //         node.classList.remove('drged');
        //     }
        // })
    }

    
    const onSelect = (id, e) => {
        let row = document.getElementById(`draggableRow${id}`);
        let rowId = row.id;
        if(row.classList.contains("selected")){
            let index = lastClicked.indexOf(rowId);
            if( index > -1){
                lastClicked.splice(index, 1);
            }
            row.classList.remove("selected");
        }else{
            // let parent = document.querySelector("[data-rbd-droppable-id]");
            // parent.childNodes.forEach((node) => {
            //     if(node.classList.contains("drged")){
            //         node.classList.remove('drged');
            //     }
            // })
            if(e.ctrlKey || e.shiftKey){
                row.classList.add("selected");
                lastClicked.push(rowId);
            }else{
                let haveToRemove = Array.from(lastClicked);

                lastClicked.forEach((id) => {
                    let element = document.getElementById(id);
                    element.classList.remove("selected");
                })
                haveToRemove.forEach((id) => {
                    let index = lastClicked.indexOf(id);
                    if( index > -1){
                        lastClicked.splice(index, 1);
                    }
                })
                row.classList.add("selected");
                lastClicked.push(rowId);
            }
        }
    }
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <h3 className='text-center my-3'>Table Drag and Drop</h3>
                    <div className='my-3'>
                        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                            <table className='table table-bordered' id="draggableTable">
                                <thead key="thead">
                                    <tr key="h-tr">
                                        <th>#</th>
                                        {
                                            columns.map((column, i) => (
                                                <td key={`${column.title}-${i}`}>{column.field}</td>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <Droppable droppableId='table-droppableId' >
                                    {
                                        (provided, snapshot) => (
                                            <tbody
                                                {...provided.droppableProps}
                                                ref = {provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}
                                            >
                                                {provided.placeholder}
                                                {
                                                    rows.map((row, index) => (
                                                        <Draggable key={row.id} draggableId={row.id} index={index} isDragDisabled={row.isDragDisable}>
                                                            {
                                                                (provided, snapshot) =>(
                                                                    <tr
                                                                        ref = {provided.innerRef}
                                                                        id={`draggableRow${row.id}`}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        onClick={(e) => onSelect(row.id, e)}
                                                                    >
                                                                        <td>{row.id}</td>
                                                                        <td>{row.YRWK}</td>
                                                                        <td>{row.CNT}</td>
                                                                        <td>{row.SEQ}</td>
                                                                        <td>{row.CUTIN}</td>
                                                                        <td>{row.TRIALREMARKS}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                        </Draggable>
                                                    ))
                                                }
                                            </tbody>
                                        )
                                    }
                                </Droppable>
                            </table>
                        </DragDropContext>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;