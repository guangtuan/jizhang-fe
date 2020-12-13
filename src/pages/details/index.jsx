import React, { useState } from 'react';
import { connect } from 'react-redux';

import * as R from 'ramda';

import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  Backdrop,
} from '@material-ui/core';

import DisplayInCalendar from './displayInCalendar';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Details({
  details,
  loadDetails,
  delDetail,
  setEdittingDetail,
  showCreateDialog,
  showEditDialog,
}) {
  const classes = useStyles();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [displayInCalendar, setDisplayInCalendar] = useState(false);

  const load = async (params) => {
    await loadDetails(params);
  };

  return (
    <React.Fragment>
      <DisplayInCalendar
        setDisplayInCalendar={setDisplayInCalendar}
        content={details.content}
        onQuery={({ start, end }) => {
          load({
            page: -1,
            size: -1,
            queryParam: { start, end }
          });
        }}
        groupProp={R.prop('createdAt')}
      ></DisplayInCalendar>
      <Backdrop className={classes.backdrop} open={deleteLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment >
  );
}

const mapState = R.pick(['accounts', 'users', 'details', 'subjects', 'detailEdit']);

const mapDispatch = (dispatch) => ({
  loadDetails: dispatch.details.load,
  delDetail: dispatch.details.del,
  showCreateDialog: dispatch.detailEdit.showCreateDialog,
  showEditDialog: dispatch.detailEdit.showEditDialog,
  setEdittingDetail: dispatch.detailEdit.setForm,
});

export default connect(mapState, mapDispatch)(Details);
