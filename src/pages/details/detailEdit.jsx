import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SubjectSelector from '../../comp/subjectSelector';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const emptyItem = () => ({
    id: undefined,
    name: "清空"
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
}));

function DetailEdit({
    detailEdit, hideDialog, changeProperty,
    users, accounts,
    updateDetail, clear, updateSingleRow
}) {
    const classes = useStyles();
    return (<Dialog
        open={detailEdit.dialogVisibility}
        TransitionComponent={Transition}>
        <DialogTitle id="form-dialog-title">编辑明细</DialogTitle>
        <DialogContent>
            <FormControl className={classes.formControl}>
                <InputLabel id="label_source_account">用户</InputLabel>
                <Select
                    MenuProps={MenuProps}
                    value={detailEdit.userId}
                    onChange={event => {
                        changeProperty({
                            key: 'userId',
                            val: event.target.value
                        });
                    }}>
                    {
                        (R.concat([emptyItem()], users)).map(user => {
                            return <MenuItem key={user.id} value={user.id}>{user.nickname}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel id="label_source_account">来源账户</InputLabel>
                <Select
                    MenuProps={MenuProps}
                    value={detailEdit.sourceAccountId}
                    onChange={event => {
                        changeProperty({
                            key: 'sourceAccountId',
                            val: event.target.value
                        });
                    }}>
                    {
                        (R.concat([emptyItem()], accounts)).map(account => {
                            return <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel id="label_desc_account">目标账户</InputLabel>
                <Select
                    MenuProps={MenuProps}
                    value={detailEdit.destAccountId}
                    onChange={event => {
                        changeProperty({
                            key: 'destAccountId',
                            val: event.target.value
                        });
                    }}>
                    {
                        (R.concat([emptyItem()], accounts)).map(account => {
                            return <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
            <SubjectSelector
                title="科目"
                value={detailEdit.subjectId}
                onChange={val => {
                    changeProperty({
                        key: 'subjectId',
                        val: val
                    });
                }}
            />
            <FormControl className={classes.formControl}>
                <TextField
                    value={detailEdit.amount}
                    label="金额（单位：元）"
                    onChange={event => {
                        changeProperty({
                            key: 'amount',
                            val: event.target.value
                        });
                    }}
                ></TextField>
            </FormControl>
            <FormControl className={classes.formControl}>
                <TextField
                    value={detailEdit.remark}
                    label="备注"
                    onChange={event => {
                        changeProperty({
                            key: 'remark',
                            val: event.target.value
                        });
                    }}
                ></TextField>
            </FormControl>
            <FormControl className={classes.formControl}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        label="请选择消费日期"
                        onChange={date => {
                            changeProperty({
                                key: 'createdAt',
                                val: date
                            });
                        }}
                        value={detailEdit.createdAt}
                    ></KeyboardDatePicker>
                </MuiPickersUtilsProvider>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button color="secondary" onClick={hideDialog}>取消</Button>
            <Button color="primary" onClick={() => {
                const pack = R.pick(['id', 'userId', 'sourceAccountId', 'destAccountId', 'subjectId', 'remark', 'amount', 'createdAt'])(detailEdit);
                pack.amount = pack.amount * 100
                updateDetail({ payload: pack, id: pack.id }).then(updated => {
                    clear()
                    hideDialog()
                    console.log(JSON.stringify(updated))
                    updateSingleRow(updated)
                })
            }}>保存</Button>
        </DialogActions>
    </Dialog>)
}

const mapState = R.pick(["accounts", "users", "details", 'detailEdit']);

const mapDispatch = dispatch => ({
    updateDetail: dispatch.detailEdit.update,
    showDialog: dispatch.detailEdit.showDialog,
    hideDialog: dispatch.detailEdit.hideDialog,
    changeProperty: dispatch.detailEdit.changeProperty,
    clear: dispatch.detailEdit.clear,
    updateSingleRow: dispatch.details.updateSingleRow
});

export default connect(mapState, mapDispatch)(DetailEdit);