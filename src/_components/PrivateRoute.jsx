import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import myFirebase from '../_services/firebase';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        myFirebase.auth().currentUser
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)