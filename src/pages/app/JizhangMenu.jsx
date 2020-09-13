import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';

import * as R from 'ramda';

import SubjectIcon from '@material-ui/icons/Subject';
import PersonIcon from '@material-ui/icons/Person';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import HomeIcon from '@material-ui/icons/Home';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PaymentIcon from '@material-ui/icons/Payment';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const pages = [
    {
        'type': 'base',
        'text': '明细',
        'icon': <HomeIcon></HomeIcon>,
        'path': '/'
    },
    {
        'type': 'base',
        'text': '账户',
        'icon': <PaymentIcon></PaymentIcon>,
        'path': '/accounts'
    },
    {
        'type': 'base',
        'text': '科目',
        'icon': <SubjectIcon></SubjectIcon>,
        'path': '/subjects'
    },
    {
        'type': 'base',
        'text': '用户',
        'icon': <PersonIcon></PersonIcon>,
        'path': '/users'
    },
    {
        'type': 'ext',
        'text': '统计',
        'icon': <EqualizerIcon></EqualizerIcon>,
        'path': '/statistics'
    },
    {
        'type': 'ext',
        'text': '账户状态',
        'icon': <AccountBalanceWalletIcon></AccountBalanceWalletIcon>,
        'path': '/accountStates'
    }
]

function JiZhangMenu(props) {
    let history = useHistory();

    const [selected, setSelected] = React.useState(0);

    return <List>
        {pages.map(({ text, icon, path }, index) => (
            <ListItem
                button
                selected={selected === index}
                key={text}
                onClick={() => {
                    history.push(path);
                    setSelected(index);
                }}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItem>
        ))}
    </List>
}

const mapState = R.pick(['']);

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(JiZhangMenu);