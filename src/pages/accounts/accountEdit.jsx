import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import Slide from '@material-ui/core/Slide'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { assoc, clone, pick } from 'ramda'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import AccountTypeSelector from '../../comp/accountTypeSelector'
import UserSelector from '../../comp/userSelector'

const Transition = React.forwardRef(function Transition (props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    formControl: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        minWidth: 120
    },
}))

function AccountEdit ({
    accountEdit,
    hideDialog,
    changeProperty,
    update,
    create,
    clearForm,
    updateSingleRow,
}) {
    const classes = useStyles()

    const [tail, setTail] = useState(undefined)
    const [userId, setUserId] = useState(undefined)
    const [type, setType] = useState(undefined)
    const [name, setName] = useState(undefined)
    const [description, setDescription] = useState(undefined)

    useEffect(() => {
        const cloneForm = clone(accountEdit.form)
        setTail(cloneForm.tail)
        setUserId(cloneForm.userId)
        setType(cloneForm.type)
        setName(cloneForm.name)
        setDescription(cloneForm.description)
    }, [accountEdit.form])

    return (
        <Dialog
            open={accountEdit.dialogVisibility}
            TransitionComponent={Transition}
        >
            <DialogTitle id="form-dialog-title">编辑账号</DialogTitle>
            <DialogContent>
                <FormControl fullWidth className={classes.formControl}>
                    <UserSelector
                        title="用户"
                        value={userId}
                        onChange={(val) => setUserId(val)}/>
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <AccountTypeSelector
                        title="账户类型"
                        value={type}
                        onChange={(val) => {
                            setType(val)
                        }}/>
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <TextField
                        value={name}
                        label="账户名字"
                        onChange={(event) => {
                            setName(event.target.value)
                        }}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <TextField
                        value={tail}
                        label="尾号"
                        onChange={(event) => {
                            setTail(event.target.value)
                        }}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                    <TextField
                        value={description}
                        label="描述"
                        onChange={(event) => {
                            setDescription(event.target.value)
                        }}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={hideDialog}>取消</Button>
                <Button color="primary" onClick={() => {
                    const pack = {
                        id: accountEdit.form.id,
                        userId,
                        type,
                        name,
                        description,
                        tail
                    }
                    if (accountEdit.creating) {
                        create(pack).then(() => {
                            clearForm()
                            hideDialog()
                        })
                    }
                    if (accountEdit.editing) {
                        update({ payload: pack, id: pack.id }).then((updated) => {
                            if (updated) {
                                console.log('update success')
                            }
                            clearForm()
                            hideDialog()
                        })
                    }
                }}>保存</Button>
            </DialogActions>
        </Dialog>
    )
}

const mapState = pick(['accountEdit'])

const mapDispatch = (dispatch) => ({
    update: dispatch.accounts.update,
    create: dispatch.accounts.create,
    updateSingleRow: dispatch.accounts.updateSingleRow,
    hideDialog: dispatch.accountEdit.hideDialog,
    showEditDialog: dispatch.accountEdit.showEditDialog,
    showCreateDialog: dispatch.accountEdit.showCreateDialog,
    changeProperty: dispatch.accountEdit.changeProperty,
    clearForm: dispatch.accountEdit.clearForm
})

export default connect(mapState, mapDispatch)(AccountEdit)
