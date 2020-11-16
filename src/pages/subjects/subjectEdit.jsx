import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as R from 'ramda';
import React from 'react';
import { connect } from 'react-redux';

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
  changeProperty,
  subjects,
  clearForm,
  createSubject,
  onSubjcetCreate
}) {
  const classes = useStyles();
  return (
    <Dialog
      open={subjects.creating}
      TransitionComponent={Transition}
    >
      <DialogTitle id="form-dialog-title">新建科目</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <TextField
            value={subjects.form.name}
            label="名称"
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
            value={subjects.form.description}
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
        <Button onClick={hideDialog}>取消</Button>
        <Button onClick={() => {
          const pack = R.pick(['name', 'description', 'level', 'parentId'])(subjects.form);
          createSubject(pack).then(resp => {
            clearForm();
            hideDialog();
            onSubjcetCreate();
          });
        }}>确认</Button>
      </DialogActions>
    </Dialog>
  )
}

const mapState = R.pick(['subjects']);

const mapDispatch = dispatch => ({
  createSubject: dispatch.subjects.create,
  clearForm: dispatch.subjects.clearForm,
  hideDialog: dispatch.subjects.hideDialog,
  changeProperty: dispatch.subjects.changeProperty
});

export default connect(mapState, mapDispatch)(SubjectEdit);