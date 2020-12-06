import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  TextField,
  Slide,
  FormControl,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pick, clone } from 'ramda';

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

function SubjectEdit({
  hideDialog,
  subjects,
  clearForm,
  createSubject,
}) {
  const classes = useStyles();

  const [name, setName] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [parentId, setParentId] = useState(undefined);
  const [parentName, setParentName] = useState(undefined);

  useEffect(() => {
    const copyForm = clone(subjects.form);
    setName(copyForm.name);
    setDescription(copyForm.description);
    setParentId(copyForm.parentId);
    setParentName(copyForm.parentName);
  }, [subjects.form]);

  return (
    <Dialog
      open={subjects.creating}
      TransitionComponent={Transition}
    >
      <DialogTitle id="form-dialog-title">新建科目</DialogTitle>
      <DialogContent>
        {
          (({ parentId, parentName }) => {
            if (parentId && parentName) {
              return <FormControl fullWidth className={classes.formControl}>
                <TextField
                  label="大类"
                  disabled
                  value={parentName}
                />
              </FormControl>
            }
          })({ parentId, parentName })
        }
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            value={name}
            label="名称"
            onChange={event => setName(event.target.value)}
          />
        </FormControl>
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            value={description}
            label="描述"
            onChange={event => setDescription(event.target.value)}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideDialog}>取消</Button>
        <Button onClick={() => {
          const pack = { name, description };
          if (parentId && parentName) {
            pack.level = 2;
            pack.parentId = parentId;
          } else {
            pack.level = 1;
          }
          createSubject(pack).then(resp => {
            clearForm();
            hideDialog();
          });
        }}>确认</Button>
      </DialogActions>
    </Dialog>
  )
}

const mapState = pick(['subjects']);

const mapDispatch = dispatch => ({
  createSubject: dispatch.subjects.create,
  clearForm: dispatch.subjects.clearForm,
  hideDialog: dispatch.subjects.hideDialog,
  changeProperty: dispatch.subjects.changeProperty
});

export default connect(mapState, mapDispatch)(SubjectEdit);