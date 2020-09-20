import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SubjectSelector from '../../comp/subjectSelector';
import AccountSelector from '../../comp/accountSelector';
import UserSelector from '../../comp/userSelector';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

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
    detailEdit,
    hideDialog,
    changeProperty,
    updateDetail,
    createDetail,
    clearForm,
    updateSingleRow
}) {
    const classes = useStyles();
    return (
        <Dialog
            open={detailEdit.dialogVisibility}
            TransitionComponent={Transition}
        >
            <DialogTitle id="form-dialog-title">编辑明细</DialogTitle>
            <DialogContent>
                <UserSelector
                    title="用户"
                    value={detailEdit.form.userId}
                    onChange={val => {
                        changeProperty({
                            key: 'sourceAccountId',
                            val: val
                        });
                    }} />
                <AccountSelector
                    title="来源账户"
                    value={detailEdit.form.sourceAccountId}
                    onChange={val => {
                        changeProperty({
                            key: 'sourceAccountId',
                            val: val
                        });
                    }} />
                <AccountSelector
                    title="目标账户"
                    value={detailEdit.form.destAccountId}
                    onChange={val => {
                        changeProperty({
                            key: 'destAccountId',
                            val: val
                        });
                    }} />
                <SubjectSelector
                    title="科目"
                    value={detailEdit.form.subjectId}
                    onChange={val => {
                        changeProperty({
                            key: 'subjectId',
                            val: val
                        });
                    }} />
                <FormControl className={classes.formControl}>
                    <TextField
                        value={detailEdit.form.amount}
                        label="金额（单位：元）"
                        onChange={event => {
                            changeProperty({
                                key: 'amount',
                                val: event.target.value
                            });
                        }}
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField
                        value={detailEdit.form.remark}
                        label="备注"
                        onChange={event => {
                            changeProperty({
                                key: 'remark',
                                val: event.target.value
                            });
                        }}
                    />
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
                            value={detailEdit.form.createdAt}
                        />
                    </MuiPickersUtilsProvider>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={hideDialog}>取消</Button>
                <Button color="primary" onClick={() => {
                    const pack = R.pick(['userId', 'sourceAccountId', 'destAccountId', 'subjectId', 'remark', 'amount', 'createdAt', 'id'])(detailEdit.form)
                    pack.amount = pack.amount * 100
                    if (detailEdit.creating) {
                        createDetail(pack).then(() => {
                            clearForm()
                            hideDialog()
                        });
                    } else if (detailEdit.editing) {
                        updateDetail({ payload: pack, id: pack.id }).then(updated => {
                            clearForm()
                            hideDialog()
                            updateSingleRow(updated)
                        });
                    } else {
                        // nothing
                    }
                }}>保存</Button>
            </DialogActions>
        </Dialog>
    )
}

const mapState = R.pick(['detailEdit']);

const mapDispatch = dispatch => ({
    updateDetail: dispatch.detailEdit.update,
    createDetail: dispatch.detailEdit.create,
    hideDialog: dispatch.detailEdit.hideDialog,
    showEditDialog: dispatch.detailEdit.showEditDialog,
    changeProperty: dispatch.detailEdit.changeProperty,
    clearForm: dispatch.detailEdit.clearForm,
    updateSingleRow: dispatch.details.updateSingleRow
});

export default connect(mapState, mapDispatch)(DetailEdit);