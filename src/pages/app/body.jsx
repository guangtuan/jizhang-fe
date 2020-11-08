import React, { useEffect } from "react";
import clsx from 'clsx';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { connect } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import * as R from 'ramda';

import Details from '../details';
import Subjects from '../subjects';
import Users from '../users';
import Accounts from '../accounts';
import Statistics from '../statistics';
import JiZhangMenu from './JizhangMenu';
import { Menu as MenuIcon } from '@material-ui/icons/';

import { Drawer, AppBar, Divider, Toolbar, IconButton, Backdrop, CircularProgress, CssBaseline } from '@material-ui/core';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


export function Body({
    loadUsers,
    loadSubjects,
    loadAccounts,
}) {

    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = React.useState(true);
    const [initLoaidng, setInitLoading] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setInitLoading(true);
        async function load() {
            await Promise.all([
                loadUsers(),
                loadSubjects(),
                loadAccounts(),
            ]);
        }
        load().then(() => {
            setInitLoading(false);
        }).catch(err => {
            setInitLoading(false);
        });
    }, []);

    return (
        <Router>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <JiZhangMenu></JiZhangMenu>
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />
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
                    </Switch>
                    <Backdrop className={classes.backdrop} open={initLoaidng}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </main>
            </div>
        </Router>
    );
}

const mapState = R.pick([]);

const mapDispatch = (dispatch) => ({
    loadUsers: dispatch.users.load,
    loadSubjects: dispatch.subjects.load,
    loadAccounts: dispatch.accounts.load,
});

export default connect(mapState, mapDispatch)(Body);