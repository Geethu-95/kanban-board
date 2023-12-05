import { useState } from 'react'
import { useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Avatar, Card, CardContent, CardHeader, IconButton, useStepContext } from '@mui/material';
import Task from '../Components/Task';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './styles.css'
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';

const initialState = [
    { id: 0, name: 'Task #1', content: 'description', state: 'ready', people: ['AV', 'DTN'] },
    { id: 1, name: 'Task #2', content: 'description', state: 'ip', people: ['DTN'] },
    { id: 2, name: 'Task #3', content: 'description', state: 'testing', people: ['AV'] },
    { id: 3, name: 'Task #4', content: 'description', state: 'done', people: ['SK'] },
]

const peopleInvolved = [

    { id: 0, name: "Anand V", shortForm: "AV" },
    { id: 1, name: "Deepti T.N", shortForm: 'DTN' },
    { id: 2, name: "Suma K", shortForm: 'SK' }

]
const Board = () => {
    const [cards, setCards] = useState(initialState)

    const [people, setPeople] = useState();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [taskCount, setTaskCount] = useState(4);

    useEffect(() => {
        document.addEventListener('dragstart', dragStart)
        document.addEventListener('dragover', allowDrop)
        document.addEventListener('dragend', dragEnd)


        return () => {
            document.removeEventListener('dragstart', dragStart)
            document.removeEventListener('dragover', allowDrop)
            document.removeEventListener('dragend', dragEnd)

        }
    }, [])

    const [taskType, setTaskType] = useState("");
    const [taskContent, setTaskContent] = useState("");

    const [readyCount, setReadyCount] = useState(0);
    const [ipCount, setIpCount] = useState(0);
    const [testingCount, setTestingCount] = useState(0);
    const [doneCount, setDoneCount] = useState(0);




    const dragStart = event => {
        if (event.target.className.includes('card')) {
            event.target.classList.add('dragging')
        }
    }

    const dragEnd = event => {
        if (event.target.className.includes('card')) {
            event.target.classList.remove('dragging')
        }
    }
    const drag = event => {
        event.dataTransfer.setData('text/plain', event.currentTarget.dataset.id)
    }

    const dragEnter = event => {
        event.currentTarget.classList.add('drop')
    }

    const dragLeave = event => {
        event.currentTarget.classList.remove('drop')
    }
    const allowDrop = event => {
        event.preventDefault()
    }
    const drop = event => {
        const column = event.currentTarget.dataset.column
        const id = Number(event.dataTransfer.getData('text/plain'))

        event.currentTarget.classList.remove('drop')

        event.preventDefault()

        const updatedState = cards.map(card => {
            if (card.id === id) {
                card.state = column
            }

            return card
        })

        setCards(updatedState)
    }

    useEffect(() => {

        setReadyCount(cards.filter(item => item.state === 'ready').length)
        setIpCount(cards.filter(item => item.state === 'ip').length)
        setTestingCount(cards.filter(item => item.state === 'testing').length)
        setDoneCount(cards.filter(item => item.state === 'done').length)


    }, [taskCount, drop])

    const [open, setOpen] = useState(false);


    const handleOpen = (value) => {
        setOpen(true);
        setTaskType(value);
    }

    const handleClose = () => setOpen(false);


    const handleAdd = (e) => {
        setTaskContent(e.target.value)

    }

    const handleAutocomplete = (event, value) => {
        value.map((person) => {
            setPeople([...people, person]);
        })
    }

    const handleSubmit = () => {
        // initialState.push({
        //     id: taskCount, name: `Task #${taskCount + 1}`, state: taskType, content: taskContent
        // })
        setCards([...cards, {
            id: taskCount, name: `Task #${taskCount + 1}`, state: taskType, content: taskContent, people: [people]
        }]);

        setTaskCount(taskCount + 1);
        handleClose();
        setPeople();
    }

    const crossLine = event => {
        const element = event.target;
        element.classList.toggle("crossed-line");
    };

    return (
        <div className='container'>
            <div className="board row">
                <h1>Kanban Board </h1><h5>(basic)</h5><br></br><br></br><br></br>
                <div
                    className="column column-todo col-lg-3 col-sm-12 columnStyles"
                    data-column="ready"
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDragOver={allowDrop}
                    onDrop={drop}
                >
                    <h3>Ready ({readyCount})</h3> <br></br>
                    {cards.filter(card => card.state === 'ready').map((item) => (
                        <div key={item.id} className="card" draggable="true" onDragStart={drag} data-id={item.id}>
                            <h3 onClick={crossLine}>{item.name}</h3>
                            {item.content}<br></br><br></br>
                            <h6>People involved</h6>
                            {item.people.map((person) => (
                                <div className='peopleAvatar'>
                                    <Avatar style={{ width: '45px', height: '45px' }} key={person} sx={{ bgcolor: deepOrange[500] }}>{person}</Avatar>
                                </div>
                            ))}
                        </div>

                    ))}
                    <IconButton aria-label="add" onClick={() => handleOpen("ready")}>
                        <AddIcon /> Add Task
                    </IconButton>
                </div>


                <div
                    className="column column-todo col-lg-3 col-sm-12 columnStyles"
                    data-column="ip"
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDragOver={allowDrop}
                    onDrop={drop}
                >
                    <h3>In Progress ({ipCount})</h3> <br></br>
                    {cards.filter(card => card.state === 'ip').map(item => (
                        <div key={item.id} className="card" draggable="true" onDragStart={drag} data-id={item.id}>

                            <h3 onClick={crossLine}>{item.name}</h3>

                            {item.content}<br></br><br></br>
                            <h6>People involved</h6>
                            {item.people.map((person) => (
                                <div display="inline-block">
                                    <Avatar style={{ width: '45px', height: '45px' }} key={person} sx={{ bgcolor: deepOrange[500] }}>{person}</Avatar>
                                </div>
                            ))}
                        </div>
                        // <Task key={item.id}  draggable="true" drag={drag} data={item}/>
                    ))}
                    <IconButton aria-label="add" onClick={() => handleOpen("ip")}>
                        <AddIcon />Add Task
                    </IconButton>
                </div>
                <div className="column column-ip col-lg-3 col-sm-12 columnStyles"
                    data-column="testing"
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDragOver={allowDrop}
                    onDrop={drop}

                >
                    <h3>Testing ({testingCount})</h3> <br></br>
                    {cards.filter(card => card.state === 'testing').map(item => (
                        <div key={item.id} className="card" draggable="true"
                            onDragStart={drag} data-id={item.id}>
                            {/* <Card > */}
                            <h3 onClick={crossLine}>{item.name}</h3>
                            {/* <CardContent> */}
                            {item.content}<br></br><br></br>
                            <h6>People involved</h6>
                            {item.people.map((person) => (
                                <div display="inline-block">
                                    <Avatar style={{ width: '45px', height: '45px' }} key={person} sx={{ bgcolor: deepOrange[500] }}>{person}</Avatar>
                                </div>
                            ))}
                        </div>
                    ))}
                    <IconButton aria-label="add" onClick={() => handleOpen("testing")}>
                        <AddIcon />Add Task
                    </IconButton>
                </div>

                <div className="column column-done col-lg-3 col-sm-12 columnStyles"
                    data-column="done"
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDragOver={allowDrop}
                    onDrop={drop}
                >
                    <h3>Done ({doneCount})</h3> <br></br>
                    {cards.filter(card => card.state === 'done').map(item => (
                        <div key={item.id} className="card" draggable="true" onDragStart={drag} data-id={item.id}>
                            {/* <Card > */}
                            <h3 onClick={crossLine}>{item.name}</h3>
                            {/* <CardContent> */}
                            {item.content}<br></br><br></br>
                            <h6>People involved</h6>
                            {item.people.map((person) => (
                                <div display="inline-block">
                                    <Avatar style={{ width: '45px', height: '45px' }} key={person} sx={{ bgcolor: deepOrange[500] }}>{person}</Avatar>
                                </div>
                            ))}
                        </div>
                    ))}
                    <IconButton aria-label="add" onClick={() => handleOpen("done")}>
                        <AddIcon />Add Task
                    </IconButton>
                </div>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <h4>Task #{taskCount + 1}</h4>
                        <label>Task Description : </label>
                        <input id="content" type="text" value={taskContent}
                            onChange={(e) => handleAdd(e)} />
                        <label>People involved : </label>
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={peopleInvolved}
                            onChange={(event, value) => handleAutocomplete(event, value)}
                            getOptionLabel={(option) => option.name || ""}
                            defaultValue={[peopleInvolved[1]]}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    // label="Select"
                                    placeholder="Make selection"
                                />
                            )}
                        /><br></br>
                        <button type="submit" onClick={handleSubmit}>Submit</button>
                    </Box>
                </Modal>

            </div>
        </div>
    )
}

export default Board
