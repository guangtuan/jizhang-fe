import React, { useEffect, useState } from 'react';
import { last, groupBy, defaultTo, compose } from 'ramda';

import { Grid, Card, Paper, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import * as updateLocale from 'dayjs/plugin/updateLocale';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', { weekStart: 1 });

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  paper: {
    width: '100%',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  monthSetting: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  table: {
    width: '100%',
    flexGrow: 1,
  },
  card: {
    maxWidth: 150,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
  },
  cardDisable: {
    maxWidth: 150,
    marginBottom: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
  dayOfMonth: {
    textAlign: 'center',
    color: 'white',
    background: theme.palette.text.primary,
  },
  dayOfMonthDisable: {
    textAlign: 'center',
    color: 'white',
    background: theme.palette.text.disabled,
  }
}));

const generateTable = (currentDate) => {
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const weekNumber = 6;
  const table = new Array(weekNumber).fill(undefined).map((_, index) => []);
  const endDayOfMonth = endOfMonth.date();
  const cellsToAdd = new Array(endDayOfMonth).fill(undefined).map((_, index) => startOfMonth.add(index, 'day'));
  // 一号如果不是星期一，要把前面的都补上
  for (let i = startOfMonth.day(); i > 1; i--) {
    table[0].push({
      d: startOfMonth.subtract(i, 'day'),
      enable: false,
    });
  }
  for (let week = 0; week < table.length; week++) {
    const currentWeekRow = table[week];
    while (currentWeekRow.length < 7) {
      if (cellsToAdd.length === 0) {
        if (currentWeekRow.length === 0) {
          break;
        } else {
          currentWeekRow.push({
            d: last(currentWeekRow).d.add(1, 'day'),
            enable: false,
          });
        }
      } else {
        currentWeekRow.push({
          d: cellsToAdd.shift(),
          enable: true,
        });
      }
    }
  }
  return table;
};

const DisplayInCalendar = ({
  content,
  render,
  groupProp,
  onDateChange,
  fmt = "YYYY-MM-DD"
}) => {

  const classes = useStyles();

  const [table, setTable] = useState([[]]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const setCurrentDateAndNotify = date => {
    setCurrentDate(date);
    const start = dayjs(date).date(1).hour(0).minute(0).second(0);
    const end = dayjs(date).date(dayjs(date).daysInMonth()).hour(23).minute(59).second(59);
    onDateChange({start, end});
  };

  const [groupContent, setGroupContent] = useState({});

  useEffect(() => {
    setTable(generateTable(currentDate));
  }, [currentDate]);

  useEffect(() => {
    setGroupContent(groupBy(compose(d => dayjs(d).format(fmt), groupProp))(content));
  }, [content]);

  return <Paper className={classes.paper}>
    <Grid container spacing={1} className={classes.monthSetting}>
      <Grid item xs>
        <Typography>{currentDate.format("YYYY-MM")}</Typography>
      </Grid>
      <Grid item xs>
        <Button
          size="small"
          className={classes.button}
          onClick={() => setCurrentDateAndNotify(currentDate.subtract(1, 'month'))}
          variant="contained"
          color="primary"
          startIcon={<SkipPreviousIcon />}
        >上个月</Button>
        <Button
          size="small"
          className={classes.button}
          onClick={() => setCurrentDateAndNotify(currentDate.add(1, 'month'))}
          variant="contained"
          color="primary"
          endIcon={<SkipNextIcon />}
        >下个月</Button>
      </Grid>
    </Grid>
    {table.map((row, rowIndex) => {
      return <Grid key={'row' + rowIndex} container className={classes.table} spacing={1}>
        {row.map((cell, cellIndex) => {
          return <Grid key={'cell' + rowIndex + cellIndex} item xs>
            <Card className={cell.enable ? classes.card : classes.cardDisable}>
              <Typography className={cell.enable ? classes.dayOfMonth : classes.dayOfMonthDisable}>{cell.d.date()}</Typography>
              {(() => {
                if (cell.enable) {
                  return render({
                    list: defaultTo([], groupContent[cell.d.format(fmt)]),
                    date: cell.d
                  });
                }
              })()}
            </Card>
          </Grid>;
        })}
      </Grid>;
    })}
  </Paper>;
}

export default DisplayInCalendar;