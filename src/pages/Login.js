import React, { Fragment, Component } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

// para las cookies
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Login extends Component {

    // para agregar el controlador de cookies a los accesorios de su clase
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        // usar axios
        this.axios = require('axios');

        // class component state
        this.state = {
            email: null,
            password: null,
            isAuthenticating: false,
            errorMessage: null
        }
    }

    isNotEmptyFields = () => {
        return this.state.email && this.state.password ? true : false
    }

    login = () => {
        if (!this.isNotEmptyFields()) return;

        this.setState(prevState => {
            return Object.assign({}, prevState, {
                isAuthenticating: true,
            })
        }, () => {
            this.loginProcess();
        });
    }

    loginProcess = () => {
        if (this.state.isAuthenticating) {

            //Asignar las credenciales al  basic OAuth
            const username = this.state.email;
            const password = this.state.password;

            // Convierta a base64
            const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
            const url = 'http://localhost:3005/authenticate';

            this.axios.post(url, {}, {
                headers : {
                    'Authorization': `Basic ${token}`
                }
            })
                .then((response) => {

                    // Configure la cookie del usuario aquí
                    this.setState(prevState => {
                        return Object.assign({}, prevState, {
                            isAuthenticating: false
                        });
                    }, () => {

                        if (response.data.id) {
                            this.setUserCookie(response.data.id);
                            window.location.href = '/task';
                        } else { // Si no hay id
                            this.setState(prevState => {
                                return Object.assign({}, prevState, {
                                    errorMessage: response.data.message
                                });
                            });
                        }
                    });

                })
                .catch(() => {
                    this.setState(prevState => {
                        return Object.assign({}, prevState, {
                            isAuthenticating: false
                        })
                    });
                });
        }
    }


    setUserCookie = (id) => {
        this.props.cookies.set('userId', id, {
            path: '/',
            maxAge: process.env.REACT_APP_ENV_COOKIES_MAX_AGE
        });
    }

    // para manejar el onChange de nuestros cuadros de entrada
    handleChange = (event) => {
        let { name, value } = event.target;

        this.setState(prevState => {
            return Object.assign({}, prevState, {
                [name] : value
            });
        });
    }

    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Login Page</title>
                </Helmet>
                <Container>
                    <Row>
                        <Col>
                            <h2 style={{ color: 'white', margin: 25 }}>Login</h2>
                            {this.state.errorMessage ? <p style={{color : "red"}}>{this.state.errorMessage}</p>:""}
                            <Form>
                                <Form.Group>
                                    <Form.Label style={{ color: 'white' }}>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email address..."
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label style={{ color: 'white'}}>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password..."
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Button disabled={this.state.isAuthenticating ? true : false} variant="primary" type="button" onClick={this.login} style={{ margin: 25, width: 300 }}>
                                    Login
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default withCookies(Login);
