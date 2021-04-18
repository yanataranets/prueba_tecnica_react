import React, { Fragment, useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useCookies } from 'react-cookie';
import { Redirect } from "react-router-dom";

const axios = require('axios');
const moment = require('moment');

export default function Task() {
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

    // Redirect if not logged in
    if (!cookies.userId) {
        return <Redirect to="/login" />
    }

    // When the value changes for the text area
    const handleChange = (event) => {
        setTask(event && event.target.value ? event.target.value:"");
    };

    // Save task
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

    // Remove tasks
    const remove = async (id) => {
        console.log(id)
        axios.delete('http://localhost:3005/tasks/' + id)
            .then(async (res) => {
                await getList();
            });
    }

    //update task
    const update = async (id, content) => {
        if (task) {
            axios.put('http://localhost:3005/tasks'+id, {
                content: task
            })
                .then(async (res) => {
                    //await getList();
                    setTask(content);
                });
        }
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
                            <Form.Label>Task</Form.Label>
                            <Form.Control as="textarea" rows="3" value={task || ""} onChange={this.handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="button" onClick={save}>
                            Post Task!
                        </Button>
                        <br/><br/>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}

