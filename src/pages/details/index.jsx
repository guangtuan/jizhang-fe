import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import * as R from 'ramda';

import { makeStyles } from '@material-ui/core/styles';
import {
  Switch,
  CircularProgress,
  Button,
  Backdrop,
  FormControl,
  FormControlLabel,
  Fab,
  Box
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import AccountSelector from '../../comp/accountSelector';
import SubjectSelector from '../../comp/subjectSelector';
import DetailCard from './detailCard';
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
  subjects,
}) {
  const classes = useStyles();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [displayInCalendar, setDisplayInCalendar] = useState(false);

  const [sourceAccountId, setSourceAccountId] = useState(undefined);
  const [destAccountId, setDestAccountId] = useState(undefined);
  const [subjectIds, setSubjectIds] = useState([]);
  // dayJs(new Date()).date(1).hour(0).minute(0).second(0)
  const [start, setStart] = useState(null);
  // dayJs(new Date()).date(dayJs(new Date()).daysInMonth()).hour(23).minute(59).second(59)
  const [end, setEnd] = useState(null);
  const [page, setPage] = useState(0);
  const size = 10;

  const load = async () => {
    await loadDetails({
      page: displayInCalendar ? -1 : page,
      size: displayInCalendar ? -1 : size,
      queryParam: {
        sourceAccountId,
        destAccountId,
        start,
        end,
        subjectIds,
      },
    });
  };

  useEffect(() => {
    load();
  }, [page, displayInCalendar]);

  return (
    <React.Fragment>
      <Box>
        <AccountSelector
          value={sourceAccountId}
          onChange={setSourceAccountId}
          title="来源账户"
        />
        <AccountSelector
          value={destAccountId}
          onChange={setDestAccountId}
          title="目标账户"
        />
        <SubjectSelector
          state={subjects.list}
          title="科目"
          multiple={true}
          value={subjectIds}
          onChange={setSubjectIds}
        />
        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              label="从"
              onChange={setStart}
              value={start}
            ></KeyboardDatePicker>
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              label="到"
              onChange={setEnd}
              value={end}
            ></KeyboardDatePicker>
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl className={classes.formControl}>
          <Button variant="contained" color="primary" onClick={load}>查询</Button>
        </FormControl>
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={displayInCalendar}
            onChange={() => {
              setDisplayInCalendar(!displayInCalendar)
            }}
            name="displayInCalendar"
            color="primary"
          />
        }
        label="以📅形式展示"
      />
      {(() => {
        if (displayInCalendar) {
          return <DisplayInCalendar
            content={details.content}
            onDateChange={({ start, end }) => {
              setStart(start);
              setEnd(end);
            }}
            render={({ list, date }) => {
              return <DetailCard
                key={JSON.stringify(date)}
                details={list}
                date={date}
                onClickCreate={(date) => () => {
                  setEdittingDetail({ createdAt: date });
                  showCreateDialog();
                }}
              />
            }}
            groupProp={R.prop('createdAt')}
          ></DisplayInCalendar>
        }
      })()}
      {(() => {
        if (!displayInCalendar) {
          return <DisplayInTable
            page={page}
            size={size}
            count={details.total}
            details={details.content}
            onChangePage={setPage}
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
      })()}
      <DetailEdit></DetailEdit>
      <Backdrop className={classes.backdrop} open={deleteLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Fab aria-label="Add" className={classes.fab} color={'primary'} onClick={showCreateDialog}>
        <AddIcon />
      </Fab>
    </React.Fragment>
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
