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
  updateSubject,
  onSave = () => { }
}) {
  const classes = useStyles();

  const [id, setId] = useState(undefined);
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
    setId(copyForm.id);
  }, [subjects.form]);

  const title = ({ creating, editing }) => {
    if (creating) {
      return '新建科目';
    }
    if (editing) {
      return '编辑科目';
    }
  }

  return (
    <Dialog
      open={subjects.creating || subjects.editing}
      TransitionComponent={Transition}
    >
      <DialogTitle id="subject-form-dialog-title">{title({ subjects })}</DialogTitle>
      <DialogContent>
        {
          (() => {
            if (parentId && parentName) {
              return <FormControl fullWidth className={classes.formControl}>
                <TextField
                  label="大类"
                  disabled
                  value={parentName}
                />
              </FormControl>
            }
          })()
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
          if (subjects.creating) {
            createSubject(pack).then(resp => {
              clearForm();
              hideDialog();
              onSave();
            });
          } else {
            updateSubject({ pack, id }).then(resp => {
              clearForm();
              hideDialog();
              onSave();
            });
          }
        }}>确认</Button>
      </DialogActions>
    </Dialog>
  )
}

const mapState = pick(['subjects']);

const mapDispatch = dispatch => ({
  createSubject: dispatch.subjects.create,
  updateSubject: dispatch.subjects.edit,
  clearForm: dispatch.subjects.clearForm,
  hideDialog: dispatch.subjects.hideDialog,
  changeProperty: dispatch.subjects.changeProperty
});

export default connect(mapState, mapDispatch)(SubjectEdit);