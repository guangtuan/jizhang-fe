import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import * as R from 'ramda';
import {useHistory} from "react-router-dom";
import {Input, Button, Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function Login({login, session}) {

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  let history = useHistory();

  const classes = useStyles();

  useEffect(() => {
    history.push("/login");
  }, []);

  return <Grid
    container
    direction="column"
    justify="center"
    alignItems="center"
    className={classes.root}
  >
    <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="输入账户"/>
    <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="输入密码"/>
    <Button onClick={async () => {
      await login({password, email});
      history.replace('/');
    }}>登录</Button>
  </Grid>;
}

const mapState = R.pick(['session']);

const mapDispatch = dispatch => ({
  login: dispatch.session.login,
});

export default connect(mapState, mapDispatch)(Login);