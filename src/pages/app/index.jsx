import React from 'react';
import { connect } from 'react-redux';
import 'element-theme-default';
import { Tabs, Button } from 'element-react';

import * as R from 'ramda';

import styles from './app.module.css';
import Details from '../details';
import Subjects from '../subjects';
import Users from '../users';
import Accounts from '../accounts';
import AccountStates from '../accountStates';
import Statistics from '../statistics';

const pages = [
    {
        title: "统计",
        comp: Statistics
    },
    {
        title: "用户",
        comp: Users
    },
    {
        title: "账户",
        comp: Accounts
    },
    {
        title: "结算记录",
        comp: AccountStates
    },
    {
        title: "明细",
        comp: Details
    },
    {
        title: "科目",
        comp: Subjects
    }
];

function App({ }) {
    return (
        <div className={styles.app}>
            <Tabs
                activeName="0">
                {pages.map((page, index) => {
                    return (
                        <Tabs.Pane
                            key={index}
                            label={page.title}
                            name={index.toString()}
                        >
                            <page.comp key={index}></page.comp>
                        </Tabs.Pane>
                    )
                })}
            </Tabs>
        </div>
    );
}

const mapState = R.pick(['currentRecord']);

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(App);