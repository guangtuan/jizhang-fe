import React, { useEffect, useState } from 'react';
import { last, groupBy, defaultTo, compose } from 'ramda';

import { Box, Grid, Card, Paper, Typography, Button } from '@material-ui/core';
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
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  monthSetting: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  card: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
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
      current: false,
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
            current: false,
          });
        }
      } else {
        currentWeekRow.push({
          d: cellsToAdd.shift(),
          current: true,
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
  fmt = "YYYY-MM-DD"
}) => {

  const classes = useStyles();

  const [table, setTable] = useState([[]]);
  const [currentDate, setCurrentDate] = useState(dayjs());

  const [groupContent, setGroupContent] = useState({});

  useEffect(() => {
    setTable(generateTable(currentDate));
  }, [currentDate]);

  useEffect(() => {
    setGroupContent(groupBy(compose(d => dayjs(d).format(fmt), groupProp))(content));
  }, [currentDate]);

  return <Paper className={classes.paper}>
    <Grid container spacing={3} className={classes.monthSetting}>
      <Grid item xs>
        <Typography>{currentDate.format("YYYY-MM")}</Typography>
      </Grid>
      <Grid item xs>
        <Button
          className={classes.button}
          onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
          variant="contained"
          color="primary"
          startIcon={<SkipPreviousIcon />}
        >上个月</Button>
        <Button
          className={classes.button}
          onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
          variant="contained"
          color="primary"
          endIcon={<SkipNextIcon />}
        >下个月</Button>
      </Grid>
    </Grid>
    {table.map((row, rowIndex) => {
      return <Grid key={'row' + rowIndex} container className={classes.root} spceing={7}>
        {row.map((cell, cellIndex) => {
          return <Grid key={'cell' + rowIndex + cellIndex} item xs={1}>
            <Card className={classes.card}>
              <Typography>{cell.d.date()}</Typography>
              {render(defaultTo([], groupContent[cell.d.format(fmt)]))}
            </Card>
          </Grid>;
        })}
      </Grid>;
    })}
  </Paper>;
}

export default DisplayInCalendar;