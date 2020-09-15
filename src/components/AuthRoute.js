import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, ...rest }) => (
    <Route render={props => localStorage.getItem('token') ? <Component {...props} /> : <Redirect to="/login" />} {...rest} />
)

export default AuthRoute;