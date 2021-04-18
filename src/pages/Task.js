import React, { Fragment, useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useCookies } from 'react-cookie';
import { Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './../styke.css';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));
const axios = require('axios');
const moment = require('moment');

export default function Task() {
    const classes = useStyles();
    const [cookies, setCookie, removeCookie] = useCookies(['userId']);
    const [task, setTask] = useState("");
    const [taskList, setTaskList] = useState([{}]);

    const getList = () => {
        axios.get('http://localhost:3005/tasks/user/' + cookies.userId)
            .then((res) => {
                if (res) {
                    setTaskList(res.data);
                }
            });
    }

    useEffect(() => {
        getList();
    }, []);

    // Redirigir si no ha iniciado sesión
    if (!cookies.userId) {
        return <Redirect to="/login" />
    }

    // Cuando el valor cambia para el área de texto
    const handleChange = (event) => {
        setTask(event && event.target.value ? event.target.value:"");
    };

    // Guardar tarea
    const save = async () => {
        if (task) {
            axios.post('http://localhost:3005/tasks', {
                user_id: cookies.userId,
                content: task
            })
                .then(async (res) => {
                    await getList();
                    setTask(null);
                });
        }
    }

    // Eliminar tareas
    const remove = async (id) => {
        console.log(id)
        axios.delete('http://localhost:3005/tasks/' + id)
            .then(async (res) => {
                await getList();
            });
    }

    // Update tareas
    const update = async (id, content) => {
        console.log(id)
        axios.put('http://localhost:3005/tasks/'+id, {
            content: task
        })
            .then(async (res) => {
                setTask(JSON.stringify(task.content));
                await getList();

            });
    }

    return (
        <Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Task</title>
            </Helmet>
            <Container>
                <Row>
                    <Col>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Tarea</Form.Label>
                            <Form.Control as="textarea" rows="3" value={task || ""} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="button" onClick={save}>
                            Publicar tarea!
                        </Button>
                        <br/><br/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2 style={{ color: 'white', margin: 25 }}>Tareas</h2>
                        {taskList.length && taskList.map((item, index) => {
                            return (
                                <Card key={index} style={{ width: '', padding: 25, margin: 50 }}>
                                    <Card.Body>
                                        <div className={classes.root}>
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel2a-content"
                                                    id="panel2a-header"
                                                >
                                                    <Typography className={classes.heading}>
                                                        <Card.Subtitle className="mb-2 text-muted">{moment(item.date_time).format('LLL')}</Card.Subtitle>
                                                        <Card.Text>{item.content}</Card.Text>
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography>
                                                        <Form.Group controlId="exampleForm.ControlTextarea1" >
                                                            <Form.Control style={{ width: 450, padding: 55, color: 'green' }}   as="textarea" rows="3" value={task || ""} onChange={handleChange} >
                                                            </Form.Control>
                                                            <Button style={{ margin: 25, width: '20%' }} size="sm" data-id={item.id} onClick={() => update(item.id)} >Actualizar</Button>
                                                        </Form.Group>
                                                    </Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                        </div>
                                        <Button style={{ margin: 25, width: '20%' }} size="sm" data-id={item.id} onClick={() => remove(item.id)} >Borrar</Button>
                                    </Card.Body>
                                </Card>

                            )
                        })}
                    </Col>
                </Row>
            </Container>
            <Container>

            </Container>
        </Fragment>
    );
}
