import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import styles from './accounts.module.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';


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
    users,
    accountTypeDefine,
    accounts, accountCreation,
    loadAccounts, createAccount,
    showDialog, hideDialog, changeProperty, clearForm
}) {

    const classes = useStyles();

    const columns = [
        {
            label: '账户类型',
            render: function ({ type }) {
                return (
                    <TableCell>
                        {R.prop("name")(R.find(R.propEq('value', type))(accountTypeDefine))}
                    </TableCell>
                )
            }
        },
        {
            label: '账户名字',
            prop: 'name'
        },
        {
            label: '所属用户',
            prop: 'username'
        },
        {
            label: '描述',
            prop: 'description'
        }
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
                                    return (<TableCell key={item}>{item}</TableCell>)
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                accounts.map(account => {
                                    return <TableRow>{
                                        columns.map(col => {
                                            if (col.render) {
                                                return col.render(account);
                                            } else {
                                                return <TableCell>{R.prop(col.prop)(account)}</TableCell>
                                            }
                                        })
                                    }</TableRow>
                                }
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            
            <Fab aria-label="Add" className={classes.fab} color={"primary"} onClick={showDialog}>
                <AddIcon />
            </Fab>
            {/* <Dialog
                title="添加账户"
                size="tiny"
                visible={accountCreation.dialogVisibility}
                onCancel={hideDialog}
                lockScroll={false}>
                <Dialog.Body>
                    <Form>
                        <Form.Item label="所属用户">
                            <Select
                                onChange={val => {
                                    changeProperty({
                                        key: 'userId',
                                        val: val
                                    });
                                }}
                                placeholder="请选择所属用户">
                                {
                                    (users || []).map(user => {
                                        return <Select.Option key={user.id} label={user.username} value={user.id} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="账户类型">
                            <Select
                                onChange={val => {
                                    changeProperty({
                                        key: 'type',
                                        val: val
                                    });
                                }}
                                placeholder="请选择账户类型">
                                {
                                    accountTypeDefine.map(({ name, value }) => {
                                        return <Select.Option key={value} label={name} value={value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="描述">
                            <Input
                                placeholder="请输入描述"
                                onChange={val => {
                                    changeProperty({
                                        key: 'description',
                                        val: val
                                    });
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item label="账户名称">
                            <Input
                                placeholder="请输入账户名称"
                                onChange={val => {
                                    changeProperty({
                                        key: 'name',
                                        val: val
                                    });
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                onClick={() => {
                                    const pack = R.pick(['userId', 'type', 'name', 'description'])(accountCreation);
                                    createAccount(pack).then(clearForm)
                                }}
                            >确定</Button>
                        </Form.Item>
                    </Form>
                </Dialog.Body>
            </Dialog> */}
        </div>
    )

};

const mapState = R.pick([
    "users", "accounts", "accountCreation", "accountTypeDefine"
]);

const mapDispatch = dispatch => ({
    loadAccounts: dispatch.accounts.load,
    createAccount: dispatch.accounts.create,
    showDialog: dispatch.accountCreation.showDialog,
    hideDialog: dispatch.accountCreation.hideDialog,
    changeProperty: dispatch.accountCreation.changeProperty,
    clearForm: dispatch.accountCreation.clear
});

export default connect(mapState, mapDispatch)(Accounts);