import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { pick, map, prop, defaultTo, sum, compose } from 'ramda';
import { Axis, Chart, Geom, Label, Tooltip } from 'bizcharts';
import SubjectSelector from '../../comp/subjectSelector';
import { KeyboardDatePicker, MuiPickersUtilsProvider, } from '@material-ui/pickers';
import { FormControl, Paper, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    header: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
    },
    chartBody: {
        marginTop: 16
    }
}));

function Statistics({
    subjects: globalSubjects, loadStatistics, statistics,
}) {

    const classes = useStyles();

    const [start, setStart] = useState(dayjs().startOf('month').toDate().getTime());
    const [end, setEnd] = useState(dayjs().set('hour', 23).set('minute', 59).set('second', 59).toDate().getTime());
    const [subjects, setSubjects] = useState(compose(map(prop('id')))(globalSubjects.flatedChildren));

    useEffect(
        () => {
            loadStatistics({ start, end, subjects });
        },
        [start, end, subjects]
    );

    // 定义度量
    const cols = {
        subjectName: { alias: '科目' }, // 数据字段别名映射
        total: { alias: '金额' }
    };

    return (
        <div>
            <Paper className={classes.header}>
                <SubjectSelector
                    title={"筛选科目"}
                    value={subjects}
                    multiple={true}
                    onChange={setSubjects}
                ></SubjectSelector>
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
                    <TextField
                        color="primary"
                        label="总花费"
                        value={`${compose(sum, map(prop('total')), defaultTo([]))(statistics.content)}`} />
                </FormControl>
            </Paper>
            {(() => {
                if (statistics.content.length === 0) {
                    return <div></div>
                }
                return (
                    <div className={classes.chartBody}>
                        <Chart width={1400} height={600} data={statistics.content} scale={cols} dy={-20}>
                            {/* X 轴 */}
                            <Axis name="subjectName" />
                            {/* Y 轴 */}
                            <Axis name="total" />
                            <Tooltip />
                            <Geom type="interval" position="subjectName*total" color="subjectName">
                                <Label content="total">
                                </Label>
                            </Geom>
                        </Chart>
                    </div>
                )
            })()}
        </div >
    )

};

const mapState = pick(["accounts", "users", "statistics", "subjects"]);

const mapDispatch = dispatch => ({
    loadStatistics: dispatch.statistics.query
});

export default connect(mapState, mapDispatch)(Statistics);