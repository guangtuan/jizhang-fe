import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider, Typography, Card } from '@material-ui/core';

import { last } from 'ramda';

import dayjs from 'dayjs';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import * as updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', { weekStart: 1 });

const useStyles = makeStyles((theme) => ({
    lineWrapper: {
        display: 'flex',
    },
    cell: {
        flex: 1,
        margin: theme.spacing(1),
    },
    cellHeader: {
        textAlign: 'center',
        color: 'white',
        padding: '4',
    },
    dayOfMonth: {
        background: theme.palette.text.primary,
    },
    dayOutOfMonth: {
        background: theme.palette.text.disabled,
    },
    weekHeader: {
        textAlign: 'center'
    },
}));

/**
 * 当返回 0 的时候表示星期天
 */
const getDayInAWeek = d => {
    if (d.day() === 0) {
        return 7;
    }
    return d.day();
}

const getWeekNumber = ({ startOfMonth, endOfMonth }) => {
    const w1 = startOfMonth.week();
    const w2 = endOfMonth.week();
    if (w1 < w2) {
        return w2 - w1 + 1;
    } else {
        let targetWeek = w2;
        let dd = endOfMonth.subtract(1, 'day');
        while (w1 > targetWeek) {
            dd = dd.subtract(1, 'day');
            targetWeek = dd.week();
        }
        return targetWeek - w1 + 1 + 1;
    }
}

const generateTable = currentDate => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const endDayOfMonth = endOfMonth.date();
    const weekNumber = getWeekNumber({ startOfMonth, endOfMonth });
    const table = new Array(weekNumber).fill(undefined).map((_, index) => []);
    const cellsToAdd = new Array(endDayOfMonth).fill(undefined).map((_, index) => startOfMonth.add(index, 'day'));
    // 一号如果不是星期一，要把前面的都补上
    for (let i = getDayInAWeek(startOfMonth); i > 1; i--) {
        table[0].push({
            dayObject: startOfMonth.subtract(i, 'day'),
            inThisMonth: false,
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
                        dayObject: last(currentWeekRow).dayObject.add(1, 'day'),
                        inThisMonth: false,
                    });
                }
            } else {
                currentWeekRow.push({
                    dayObject: cellsToAdd.shift(),
                    inThisMonth: true,
                });
            }
        }
    }
    return table;
};

const headers = ["Mon", "Tue", "Thur", "Web", "Fri", "Sat", "Sun",];

export default function JizhangCalendar({
    currentDate = dayjs(),
    displayFunction = () => { }
}) {

    const classes = useStyles();
    const [table, setTable] = useState([]);

    const getClass = thisMonth => {
        if (thisMonth) {
            return `${classes.cellHeader} ${classes.dayOfMonth}`;
        } else {
            return `${classes.cellHeader} ${classes.dayOutOfMonth}`;
        }
    }

    useEffect(() => {
        setTable(generateTable(currentDate));
    }, [currentDate]);

    return <Box component='div'>
        <Box className={classes.lineWrapper}>
            {
                headers.map((val, colIndex) => {
                    return <Box
                        key={`jizhangCalendar-header-col-${colIndex}`}
                        className={classes.cell}>
                        <Typography
                            component='h3'
                            className={classes.weekHeader}>
                            {val}
                        </Typography>
                    </Box>;
                })
            }
        </Box>
        {
            table.map((row, rowIndex) => {
                return <Box
                    key={`jizhangCalendar-row${rowIndex}`}
                    className={classes.lineWrapper}>
                    {
                        row.map((col, colIndex) => {
                            return <Card
                                className={classes.cell}
                                key={`jizhangCalendar-row${rowIndex}-col-${colIndex}`}
                            >
                                <Typography
                                    component='h6'
                                    className={getClass(col.inThisMonth)}>
                                    {col.dayObject.date()}
                                </Typography>
                                {
                                    displayFunction({ rowIndex, colIndex, inThisMonth: col.inThisMonth, dayObject: col.dayObject })
                                }
                            </Card>;
                        })
                    }
                </Box>
            })
        }
    </Box>

}