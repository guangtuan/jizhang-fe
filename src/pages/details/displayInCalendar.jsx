import React, { useEffect, useState } from 'react';
import { keys, reject, pick, groupBy, equals, defaultTo, prop, compose } from 'ramda';
import { connect } from 'react-redux';
import { Card, Box, Typography, Button, FormControlLabel, Switch, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import * as updateLocale from 'dayjs/plugin/updateLocale';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import TodayIcon from '@material-ui/icons/Today';
import JizhangCalendar from '../../comp/jizhangCalendar';
import DetailCard from './detailCard';
import DetailEdit from './detailEdit';
import Today from './Today';

dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', { weekStart: 1 });

const fmt = "YYYY-MM-DD";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  container: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  control: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlSwitch: {
    marginLeft: 0,
  },
}));

const DisplayInCalendar = ({
  content,
  displayInCalendar = true,
  setDisplayInCalendar,
  setEdittingDetail,
  showCreateDialog,
  onQuery = () => { }
}) => {

  const classes = useStyles();

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [groupContent, setGroupContent] = useState({});
  const [tick, setTick] = useState(0);
  const [detailsToday, setDetailsToday] = useState([]);
  const [todayDialogShow, setTodayDialogShow] = useState(false);
  const [popDateStr, setPopDateStr] = useState(undefined);

  useEffect(() => {
    const start = currentDate.date(1).hour(0).minute(0).second(0);
    const end = currentDate.date(dayjs(currentDate).daysInMonth()).hour(23).minute(59).second(59);
    onQuery({ start, end });
  }, [currentDate, tick]);

  useEffect(() => {
    setGroupContent(groupBy(compose(d => dayjs(d).date(), prop('createdAt')))(content));
  }, [content]);

  return <Box className={classes.container}>
    <Card spacing={1} className={classes.control}>
      <FormControlLabel
        className={classes.controlSwitch}
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
      <FormControl>
        <Typography
          component='h1'
          className={classes.controlTitle}
        >{currentDate.format("YYYY年MM月")}
        </Typography>
      </FormControl>
      <Box>
        <Button
          size="small"
          className={classes.button}
          onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
          variant="contained"
          color="primary"
          startIcon={<SkipPreviousIcon />}
        >上个月</Button>
        <Button
          size="small"
          className={classes.button}
          onClick={() => setCurrentDate(dayjs(new Date()))}
          variant="contained"
          color="primary"
          startIcon={<TodayIcon />}
        >今天</Button>
        <Button
          size="small"
          className={classes.button}
          onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
          variant="contained"
          color="primary"
          endIcon={<SkipNextIcon />}
        >下个月</Button>
      </Box>
    </Card>
    <JizhangCalendar
      currentDate={currentDate}
      displayFunction={({ rowIndex, colIndex, dayObject, inThisMonth }) => {
        if (!inThisMonth) {
          return <></>;
        }
        const list = defaultTo([], groupContent[dayObject.date()]);
        return <DetailCard
          key={dayObject.format(fmt)}
          details={list}
          onClickShowAll={detailsToday => () => {
            setDetailsToday(detailsToday);
            setTodayDialogShow(true);
            setPopDateStr(dayObject.format("YYYY-MM-DD"));
          }}
          onClickCreate={() => {
            setEdittingDetail({ createdAt: new Date(dayObject.valueOf()) });
            showCreateDialog();
          }}
          onClickCopy={(detail) => () => {
            const form = pick(reject(equals('id'))(keys(detail)))(detail);
            setEdittingDetail(form);
            showCreateDialog();
          }}
        />
      }}>
    </JizhangCalendar>
    <DetailEdit
      onCreateDone={() => setTick(tick + 1)}
    ></DetailEdit>
    <Today
      dateStr={popDateStr}
      show={todayDialogShow}
      details={detailsToday}
      onClockClose={() => { setTodayDialogShow(false) }}
    ></Today>
  </Box>;
}

const mapState = pick(['accounts', 'users', 'details', 'subjects', 'detailEdit']);

const mapDispatch = (dispatch) => ({
  loadDetails: dispatch.details.load,
  delDetail: dispatch.details.del,
  showCreateDialog: dispatch.detailEdit.showCreateDialog,
  showEditDialog: dispatch.detailEdit.showEditDialog,
  setEdittingDetail: dispatch.detailEdit.setForm,
});

export default connect(mapState, mapDispatch)(DisplayInCalendar);