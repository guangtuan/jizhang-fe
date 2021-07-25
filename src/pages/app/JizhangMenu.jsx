import React from "react";
import {useHistory} from "react-router-dom";
import {connect} from 'react-redux';

import * as R from 'ramda';

import SubjectIcon from '@material-ui/icons/Subject';
import PersonIcon from '@material-ui/icons/Person';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PaymentIcon from '@material-ui/icons/Payment';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import ListIcon from '@material-ui/icons/List';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EventIcon from '@material-ui/icons/Event';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const pages = [
    {
        type: 'base',
        text: '日历',
        icon: <DateRangeIcon></DateRangeIcon>,
        path: '/'
    },
    {
        type: 'base',
        text: '列表',
        icon: <ListIcon></ListIcon>,
        path: '/list'
    },
    {
        type: 'base',
        text: '账户',
        icon: <PaymentIcon></PaymentIcon>,
        path: '/accounts'
    },
    {
        type: 'base',
        text: '科目',
        icon: <SubjectIcon></SubjectIcon>,
        path: '/subjects'
    },
    {
        type: 'base',
        text: '用户',
        icon: <PersonIcon></PersonIcon>,
        path: '/users'
    },
    {
        type: 'base',
        text: '信用卡',
        icon: <CreditCardIcon></CreditCardIcon>,
        path: '/credit_cards'
    },
    {
        type: 'ext',
        text: '统计',
        icon: <EqualizerIcon></EqualizerIcon>,
        path: '/statistics'
    },
    {
        type: 'ext',
        text: '趋势',
        icon: <TrendingUpIcon></TrendingUpIcon>,
        path: '/subjectStat'
    },
    {
        type: 'ext',
        text: '事件',
        icon: <EventIcon></EventIcon>,
        path: '/event'
    }
]

function JiZhangMenu(props) {
    let history = useHistory();

    const currentPageIndex = R.findIndex(page => window.location.href.endsWith(page.path))(pages);

    const [selected, setSelected] = React.useState(R.defaultTo(0, currentPageIndex));

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

const mapState = R.pick([]);

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(JiZhangMenu);