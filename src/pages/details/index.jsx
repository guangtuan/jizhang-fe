import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import * as R from 'ramda';

import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  Backdrop,
} from '@material-ui/core';

import DetailEdit from './detailEdit';
import DisplayInCalendar from './displayInCalendar';
import DisplayInTable from './displayInTable';

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
  const [displayInCalendar, setDisplayInCalendar] = useState(true);

  // {
  //       page: displayInCalendar ? -1 : page,
  //       size: displayInCalendar ? -1 : size,
  //       queryParam: {
  //         sourceAccountId,
  //         destAccountId,
  //         start,
  //         end,
  //         subjectIds,
  //       },
  //     }

  const load = async (params) => {
    await loadDetails(params);
  };

  return (
    <React.Fragment>
      {
        (() => {
          if (displayInCalendar) {
            return <DisplayInCalendar
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
          } else {
            return <DisplayInTable
              displayInCalendar={displayInCalendar}
              setDisplayInCalendar={setDisplayInCalendar}
              count={details.total}
              details={details.content}
              onClickCopy={(data) => () => {
                setEdittingDetail(data);
                showCreateDialog();
              }}
              onClickEdit={(data) => () => {
                setEdittingDetail(data);
                showEditDialog();
              }}
              onClickDelete={(data) => async () => {
                setDeleteLoading(true);
                await delDetail(data.id);
                await load();
                setDeleteLoading(false);
              }}
            ></DisplayInTable>
          }
        })()
      }
      <DetailEdit></DetailEdit>
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
