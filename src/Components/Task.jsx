import { Card, CardContent, CardHeader } from "@mui/material";

export default function Task(props) {

    return (

        <>
            <Card 
            style={{height:'30px',width:'200px'}}
              draggable="true" onDragStart={props.drag} id={props.id}
            >
                <CardHeader>
                    {props.otherData.name}
                </CardHeader>
                <CardContent>
                    {props.otherData.content}
                </CardContent>
            </Card>
        </>
    )
}