import React from "react";
import {
    BrowserRouter as Router,
} from "react-router-dom";

import { connect } from 'react-redux';

import * as R from 'ramda';

import Login from '../login';
import Body from './body';

export function App({
    session
}) {

    function ifLogin() {
        return session && session.token && session.nickname;
    }

    if (!ifLogin()) {
        return (
            <Router>
                <Login />
            </Router>
        );
    }
    return <Body></Body>;
}

const mapState = R.pick(['session']);

const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(App);