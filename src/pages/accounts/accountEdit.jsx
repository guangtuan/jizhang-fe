import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import UserSelector from '../../comp/userSelector';
import AccountTypeSelector from '../../comp/accountTypeSelector';

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

function AccountEdit({
    accountEdit,
    hideDialog,
    changeProperty,
    update,
    create,
    clearForm,
    updateSingleRow
}) {
    const classes = useStyles();
    return (
        <Dialog
            open={accountEdit.dialogVisibility}
            TransitionComponent={Transition}
        >
            <DialogTitle id="form-dialog-title">编辑明细</DialogTitle>
            <DialogContent>
                <UserSelector
                    title="用户"
                    value={accountEdit.form.userId}
                    onChange={val => {
                        changeProperty({
                            key: 'userId',
                            val: val
                        });
                    }} />
                <AccountTypeSelector
                    title="账户类型"
                    value={accountEdit.form.type}
                    onChange={val => {
                        changeProperty({
                            key: 'type',
                            val: val
                        });
                    }} />
                <FormControl className={classes.formControl}>
                    <TextField
                        value={accountEdit.form.name}
                        label="账户名字"
                        onChange={event => {
                            changeProperty({
                                key: 'name',
                                val: event.target.value
                            });
                        }}
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField
                        value={accountEdit.form.description}
                        label="描述"
                        onChange={event => {
                            changeProperty({
                                key: 'description',
                                val: event.target.value
                            });
                        }}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={hideDialog}>取消</Button>
                <Button color="primary" onClick={() => {
                    const pack = R.pick(['userId', 'type', 'name', 'description'])(accountEdit.form)
                    if (accountEdit.creating) {
                        create(pack).then(() => {
                            clearForm()
                            hideDialog()
                        });
                    } else if (accountEdit.editing) {
                        update({ payload: pack, id: pack.id }).then(updated => {
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

const mapState = R.pick(['accountEdit']);

const mapDispatch = dispatch => ({
    update: dispatch.accounts.update,
    create: dispatch.accounts.create,
    hideDialog: dispatch.accountEdit.hideDialog,
    showEditDialog: dispatch.accountEdit.showEditDialog,
    showCreateDialog: dispatch.accountEdit.showCreateDialog,
    changeProperty: dispatch.accountEdit.changeProperty,
    clearForm: dispatch.accountEdit.clearForm,
    updateSingleRow: dispatch.accountEdit.updateSingleRow
});

export default connect(mapState, mapDispatch)(AccountEdit);