import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import dayjs from 'dayjs';
import * as R from 'ramda';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import AccountEdit from './accountEdit';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  container: {
    maxHeight: 700,
  },
  opt: {
    margin: theme.spacing(1),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Accounts({
                    setForm,
                    users,
                    accountTypeDefine,
                    accounts, accountEdit,
                    loadAccounts, createAccount, deleteAccount,
                    showEditDialog, showCreateDialog, hideDialog, changeProperty, clearForm,
                  }) {
  const classes = useStyles();

  const columns = [
    {
      label: '账户类型',
      render: function({type}) {
        return (
          <TableCell>
            {R.prop('name')(R.find(R.propEq('value', type))(accountTypeDefine))}
          </TableCell>
        );
      },
    },
    {
      label: '账户名字',
      prop: 'name',
    },
    {
      label: '所属用户',
      prop: 'nickname',
    },
    {
      label: '描述',
      prop: 'description',
    },
    {
      label: '创建时间',
      render: ({createdAt}) => {
        if (!createdAt) {
          return <TableCell/>;
        }
        return (<TableCell>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>);
      },
    },
    {
      label: '更新时间',
      render: ({updatedAt}) => {
        if (!updatedAt) {
          return <TableCell/>;
        }
        return (<TableCell>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>);
      },
    },
    {
      label: '操作',
      render: function (data) {
        return (
          <TableCell>
            <div>
              <Button
                className={classes.opt}
                size="small"
                startIcon={<EditIcon/>}
                variant="contained"
                color="primary"
                onClick={() => {
                  setForm(data);
                  showEditDialog();
                }}
              >编辑</Button>
              <Button
                className={classes.opt}
                size="small"
                startIcon={<DeleteIcon />}
                variant="contained"
                color="secondary"
                onClick={async () => {
                  deleteAccount(data);
                }}
              >删除</Button>
            </div>
          </TableCell >
        );
      },
    },
  ];

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <div>
      <Paper>
        <TableContainer className={classes.container} component={Paper}>
          <Table stickyHeader className={classes.table} aria-label="simple table" >
            <TableHead>
              <TableRow>
                {columns.map(R.prop('label')).map((item) => {
                  return (<TableCell key={item}>{item}</TableCell>);
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                accounts.map((account) => {
                  return <TableRow>{
                    columns.map((col) => {
                      if (col.render) {
                        return col.render(account);
                      } else {
                        return <TableCell>{R.prop(col.prop)(account)}</TableCell>;
                      }
                    })
                  }</TableRow>;
                },
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Fab aria-label="Add" className={classes.fab} color={'primary'} onClick={showCreateDialog}>
        <AddIcon />
      </Fab>
      <AccountEdit/>
    </div>
  );
};

const mapState = R.pick([
  'users', 'accounts', 'accountEdit', 'accountTypeDefine',
]);

const mapDispatch = (dispatch) => ({
  loadAccounts: dispatch.accounts.load,
  createAccount: dispatch.accounts.create,
  deleteAccount: dispatch.accounts.del,
  showCreateDialog: dispatch.accountEdit.showCreateDialog,
  showEditDialog: dispatch.accountEdit.showEditDialog,
  hideDialog: dispatch.accountEdit.hideDialog,
  changeProperty: dispatch.accountEdit.changeProperty,
  clearForm: dispatch.accountEdit.clearForm,
  setForm: dispatch.accountEdit.setForm,
});

export default connect(mapState, mapDispatch)(Accounts);
