import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { pick, clone } from 'ramda';
import { makeStyles } from '@material-ui/core/styles';
import {
    Dialog,
    Slide,
    Button,
    TextField,
    FormControl,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@material-ui/core';
import SubjectSelector from '../../comp/subjectSelector';
import AccountSelector from '../../comp/accountSelector';
import UserSelector from '../../comp/userSelector';
import JizhangDateSelector from '../../comp/jizhangDateSelector';
import EventSelector from '../../comp/eventSelector';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    formControl: {
        marginTop: theme.spacing(1),
        marginBotton: theme.spacing(1)
    },
}));

function DetailEdit({
    session,
    detailEdit,
    hideDialog,
    onCreateDone = () => { },
    updateDetail,
    createDetail,
    clearForm,
    updateSingleRow,
    link
}) {
    const classes = useStyles();
    const [userId, setUserId] = useState(undefined);
    const [sourceAccountId, setSourceAccountId] = useState(undefined);
    const [destAccountId, setDestAccountId] = useState(undefined);
    const [subjectId, setSubjectId] = useState(undefined);
    const [amount, setAmount] = useState(undefined);
    const [remark, setRemark] = useState(undefined);
    const [createdAt, setCreatedAt] = useState(undefined);
    const [eventId, setEventId] = useState(undefined);

    useEffect(() => {
        const cloneForm = clone(detailEdit.form);
        setUserId(cloneForm.userId || session.userId);
        setSourceAccountId(cloneForm.sourceAccountId);
        setDestAccountId(cloneForm.destAccountId);
        setSubjectId(cloneForm.subjectId);
        setAmount(cloneForm.amount);
        setRemark(cloneForm.remark);
        setCreatedAt(cloneForm.createdAt);
    }, [detailEdit.form]);

    return (
        <Dialog
            open={detailEdit.dialogVisibility}
            TransitionComponent={Transition}
        >
            <DialogTitle id='form-dialog-title'>{detailEdit.creating ? '新建明细' : '编辑明细'}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth className={classes.formControl}>
                    <UserSelector
                        title='用户'
                        value={userId}
                        onChange={setUserId}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <AccountSelector
                        title='来源账户'
                        value={sourceAccountId}
                        onChange={setSourceAccountId}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <AccountSelector
                        title='目标账户'
                        value={destAccountId}
                        onChange={setDestAccountId}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <SubjectSelector
                        multiple={false}
                        title='科目'
                        value={subjectId}
                        onChange={setSubjectId}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <TextField
                        value={amount}
                        label='金额（单位：元）'
                        onChange={event => setAmount(event.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <TextField
                        defaultValue={remark}
                        label='备注'
                        multiline
                        rowsMax={4}
                        onChange={event => setRemark(event.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <JizhangDateSelector
                        label='请选择消费日期'
                        setValue={setCreatedAt}
                        value={createdAt}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <EventSelector
                        title='事件'
                        onChange={setEventId}
                        value={eventId}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button color='secondary' onClick={hideDialog}>取消</Button>
                <Button color='primary' onClick={async () => {
                    const pack = {
                        userId, sourceAccountId, destAccountId, subjectId, remark, amount: amount * 100, createdAt
                    };
                    if (detailEdit.creating) {
                        const created = await createDetail(pack)
                        clearForm()
                        hideDialog()
                        onCreateDone();
                        setEventId(undefined)
                        if (eventId) {
                            await link({
                                detailId: created.id,
                                eventId: eventId
                            })
                            setEventId(undefined)
                        }
                    }
                    if (detailEdit.editing) {
                        const updated = await updateDetail({ payload: pack, id: detailEdit.form.id })
                        clearForm()
                        hideDialog()
                        updateSingleRow(updated)
                        if (eventId) {
                            await link({
                                detailId: updated.id,
                                eventId: eventId
                            })
                            setEventId(undefined)
                        }
                    }
                }}>保存
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const mapState = pick(['detailEdit', 'session']);

const mapDispatch = dispatch => ({
    updateDetail: dispatch.detailEdit.update,
    createDetail: dispatch.detailEdit.create,
    hideDialog: dispatch.detailEdit.hideDialog,
    showEditDialog: dispatch.detailEdit.showEditDialog,
    clearForm: dispatch.detailEdit.clearForm,
    updateSingleRow: dispatch.details.updateSingleRow,
    link: dispatch.event.link
});

export default connect(mapState, mapDispatch)(DetailEdit);