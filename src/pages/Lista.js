import React, { Fragment, useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useCookies } from 'react-cookie';
import { Redirect } from "react-router-dom";

const axios = require('axios');
const moment = require('moment');

export default function Lista() {
    const [taskList, setList] = useState([{}]);
    const getListTask = () => {
        axios.get('http://localhost:3005/lista')
            .then((res) => {
                setList(res.data);
            });
    }

    useEffect(() => {
        getListTask();
    }, []);

    return (
        <Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Tarea</title>
            </Helmet>
            <Container>
                <Row>
                    <Col>
                        <h2 style={{ color: 'white' }}>Tareas</h2>
                        {taskList.length && taskList.map((item, index) => {
                            return (
                                <Card key={index} style={{ width: '100%' }}>
                                    <Card.Body>
                                        <Card.Subtitle className="mb-2 text-muted">{moment(item.date_time).format('LLL')}</Card.Subtitle>
                                        <Card.Text>{item.content}</Card.Text>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}
