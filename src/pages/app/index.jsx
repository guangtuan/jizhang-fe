import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import { connect } from 'react-redux';

import 'element-theme-default';

import * as R from 'ramda';
import styles from './app.module.css';

import Details from '../details';
import Subjects from '../subjects';
import Users from '../users';
import Accounts from '../accounts';
import AccountStates from '../accountStates';
import Statistics from '../statistics';
import Login from '../login';

import { Layout, Menu } from 'element-react';

const pages = [
    {
        title: "明细",
        component: Details,
        path: '/'
    },
    {
        title: "用户",
        component: Users,
        path: '/users'
    },
    {
        title: "账户",
        component: Accounts,
        path: '/accounts'
    },
    {
        title: "科目",
        component: Subjects,
        path: '/subjects'
    },
    {
        title: "统计",
        component: Statistics,
        path: '/statistics'
    },
    {
        title: "结算记录",
        component: AccountStates,
        path: '/accountStates'
    }
];

function CreateMenu(props) {
    let history = useHistory();

    function createHandleFunction(indexPath) {
        console.log("call me", indexPath);
        history.push(indexPath);
    }

    return (
        <Menu defaultActive="details" onSelect={createHandleFunction}>
            {
                props.pages.map((page, index) => (
                    <Menu.Item
                        key={page.title}
                        index={page.path}
                        path={page.path}
                    >{page.title}</Menu.Item>
                ))
            }
        </Menu>
    );
}

function getContent(login) {
    if (!login) {
        return (
            <Login />
        );
    } else {
        return (
            <div>
                <div className={styles.topBar}></div>
                <Layout.Row>
                    <Layout.Col span="2" >
                        <CreateMenu pages={pages}></CreateMenu>
                    </Layout.Col>
                    <Layout.Col span="20" className={styles.content}>
                        <Switch>
                            <Route exact path="/">
                                <Details />
                            </Route>
                            <Route path="/users">
                                <Users />
                            </Route>
                            <Route path="/accounts">
                                <Accounts />
                            </Route>
                            <Route path="/subjects">
                                <Subjects />
                            </Route>
                            <Route path="/statistics">
                                <Statistics />
                            </Route>
                            <Route path="/accountStates">
                                <AccountStates />
                            </Route>
                        </Switch>
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
    }
}

export function App({ session }) {

    function ifLogin() {
        return !!session.token;
    }

    return (
        <Router>
            {getContent(ifLogin())}
        </Router>
    );
}

const mapState = R.pick(['currentRecord', 'session']);

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(App);