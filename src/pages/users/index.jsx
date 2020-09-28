import {Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@material-ui/core';
import {makeStyles,} from '@material-ui/core/styles';
import {Add as AddIcon,} from '@material-ui/icons';
import * as R from 'ramda';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import UserEdit from './UserEdit';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  container: {
    maxHeight: 600,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

function Users({
                 users,
                 loadUser,
                 showCreateUserDialog
               }) {
  const classes = useStyles();

  const columns = [
    {
      label: '账号',
      prop: 'email',
    },
    {
      label: '用户名',
      prop: 'nickname',
    },
  ];

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div>
      <Paper>
        <TableContainer className={classes.container} component={Paper}>
          <Table stickyHeader className={classes.table}>
            <TableHead>
              <TableRow>
                {columns.map(R.prop('label')).map((label) => {
                  return <TableCell key={label}>{label}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>{
              users.content.map((user, index) => (
                <TableRow key={index}>{
                  columns.map((col, index) => (
                    <TableCell key={index}>{R.prop(col.prop)(user)}</TableCell>
                  ))
                }</TableRow>
              ))
            }</TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Fab aria-label="Add" className={classes.fab} color={'primary'} onClick={showCreateUserDialog}>
        <AddIcon/>
      </Fab>
      <UserEdit/>
    </div>
  );
}

const mapState = R.pick(['users']);

const mapDispatch = (dispatch) => ({
  loadUser: dispatch.users.load,
  showCreateUserDialog: dispatch.users.showCreateUserDialog
});

export default connect(mapState, mapDispatch)(Users);