import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Slide from '@material-ui/core/Slide';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as R from 'ramda';
import React from 'react';
import {connect} from 'react-redux';

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

function UserEdit({
                    hideUserDialog,
                    changeProperty,
                    users,
                    clearUserForm,
                    createUser
                  }) {
  const classes = useStyles();
  return (
    <Dialog
      open={users.creating}
      TransitionComponent={Transition}
    >
      <DialogTitle id="form-dialog-title">新建用户</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <TextField
            value={users.form.email}
            label="邮箱"
            onChange={event => {
              changeProperty({
                key: 'email',
                val: event.target.value
              });
            }}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            value={users.form.nickname}
            label="昵称"
            onChange={event => {
              changeProperty({
                key: 'nickname',
                val: event.target.value
              });
            }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideUserDialog}>取消</Button>
        <Button onClick={() => {
          const pack = R.pick(['email', 'nickname'])(users.form);
          createUser(pack).then(resp => {
            clearUserForm();
            hideUserDialog();
          });
        }}>确认</Button>
      </DialogActions>
    </Dialog>
  )
}

const mapState = R.pick(['users']);

const mapDispatch = dispatch => ({
  hideUserDialog: dispatch.users.hideUserDialog,
  changeProperty: dispatch.users.changeProperty,
  createUser: dispatch.users.createUser,
  clearUserForm: dispatch.users.clearUserForm
});

export default connect(mapState, mapDispatch)(UserEdit);