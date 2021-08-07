import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import {
    Button,
    TextField,
    Slide,
    Dialog,
    FormControl,
    DialogActions,
    DialogTitle,
    DialogContent,
} from '@material-ui/core'

import UserSelector from './userSelector'

const Transition = React.forwardRef(function Transition (props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}))

export const FORM_TYPE = {
    TEXT: 'text',
    NUMBER: 'number',
    USER_SELECTOR: 'USER_SELECTOR',
}

const mapToForm = ({
    form: {
        type,
        key,
        label,
        enable = true,
    },
    formData,
    compKey,
}) => {
    if (type === FORM_TYPE.TEXT) {
        return <TextField
            key={compKey}
            label={label}
            disabled={!enable}
            value={formData[key]}
            onChange={(event) => {
                formData[key] = event.target.value
            }}
        />
    }
    if (type === FORM_TYPE.NUMBER) {
        return <TextField
            key={compKey}
            label={label}
            disabled={!enable}
            value={formData[key]}
            onChange={(event) => {
                formData[key] = parseInt(event.target.value)
            }}
        />
    }
    if (type === FORM_TYPE.USER_SELECTOR) {
        return <UserSelector
            title={label}
            onChange={(value) => {
                formData[key] = value
            }}
            value={formData[key]}
            multiple={false}>
        </UserSelector>
    }

    return <></>
}


function DynamicFormDialog ({
    title,
    ifOpen,
    forms,
    formData,
    onClickCancel,
    onClickOK,
}) {
    const classes = useStyles()

    return <Dialog
        open={ifOpen}
        TransitionComponent={Transition}
    >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
            {
                forms.map((form, index) => {
                    const formKey = `form-dialog-${title}-form-${index}`
                    const compKey = `form-dialog-${title}-comp-${index}`
                    return <FormControl fullWidth className={classes.formControl} key={formKey}>
                        {mapToForm({
                            form,
                            formData,
                            compKey,
                        })}
                    </FormControl>
                })
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={onClickCancel}>取消</Button>
            <Button onClick={onClickOK}>确认</Button>
        </DialogActions>
    </Dialog>
}

DynamicFormDialog.FORM_TYPE = FORM_TYPE

export default DynamicFormDialog
