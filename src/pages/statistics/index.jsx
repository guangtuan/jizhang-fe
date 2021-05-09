import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { pick, map, prop, defaultTo, sum, compose, pipe } from 'ramda';
import { Axis, Chart, Geom, Label, Tooltip } from 'bizcharts';
import SubjectSelector from '../../comp/subjectSelector';
import { KeyboardDatePicker, MuiPickersUtilsProvider, } from '@material-ui/pickers';
import { FormControl, FormControlLabel, FormLabel, Radio, Paper, TextField, RadioGroup } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import { subjectLevel } from '../../core/def';
import { writeToLocal, loadFromLocal } from '../../core/local';

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


const namespace = 'statistics';
const loadFromLocalSt = loadFromLocal(namespace);
const writeToLocalSt = writeToLocal(namespace);

function Statistics({
    subjects: globalSubjects, loadStatistics, statistics,
}) {

    const classes = useStyles();

    const [level, setLevel] = useState(pipe(
        loadFromLocalSt,
        Number.parseInt,
        defaultTo(subjectLevel.SMALL)
    )('level'));

    const [start, setStart] = useState(pipe(
        loadFromLocalSt,
        Number.parseFloat,
        defaultTo(dayjs().startOf('month').toDate().getTime())
    )('start'));

    const [end, setEnd] = useState(pipe(
        loadFromLocalSt,
        Number.parseFloat,
        defaultTo(dayjs().set('hour', 23).set('minute', 59).set('second', 59).toDate().getTime())
    )('end'));

    const [subjectsSmall, setSubjectsSmall] = useState(pipe(
        loadFromLocalSt,
        JSON.parse,
        defaultTo(compose(map(prop('id')))(globalSubjects.flatedChildren))
    )('subjectsSmall'));

    const [subjectsBig, setSubjectsBig] = useState(pipe(
        loadFromLocalSt,
        JSON.parse,
        defaultTo(compose(map(prop('id')))(globalSubjects.subjectTree))
    )('subjectsBig'));

    useEffect(
        () => {
            if (level === subjectLevel.BIG) {
                loadStatistics({ start, end, subjects: subjectsBig, level });
            } else {
                loadStatistics({ start, end, subjects: subjectsSmall, level });
            }
        },
        [start, end, level, subjectsSmall, subjectsBig]
    );

    // 定义度量
    const cols = {
        subjectName: { alias: '科目' }, // 数据字段别名映射
        total: { alias: '金额' }
    };

    return (
        <div>
            <Paper className={classes.header}>
                <FormControl label="科目类型">
                    <FormLabel component="legend">科目类型</FormLabel>
                    <RadioGroup row aria-label="科目类型" name="科目类型" value={level} onChange={event => {
                        setLevel(Number.parseInt(event.target.value));
                        writeToLocalSt({ key: 'level', value: event.target.value });
                    }}>
                        <FormControlLabel value={subjectLevel.BIG} control={<Radio />} label="大类" />
                        <FormControlLabel value={subjectLevel.SMALL} control={<Radio />} label="子类" />
                    </RadioGroup>
                </FormControl>
                {
                    level === subjectLevel.BIG && <SubjectSelector
                        level={subjectLevel.BIG}
                        value={subjectsBig}
                        multiple={true}
                        onChange={arr => {
                            setSubjectsBig(arr);
                            writeToLocalSt({ key: 'subjectsBig', value: JSON.stringify(arr) })
                        }}
                    ></SubjectSelector>
                }
                {
                    level === subjectLevel.SMALL && <SubjectSelector
                        value={subjectsSmall}
                        multiple={true}
                        onChange={arr => {
                            setSubjectsSmall(arr);
                            writeToLocalSt({ key: 'subjectsSmall', value: JSON.stringify(arr) })
                        }}
                    ></SubjectSelector>
                }
                <FormControl className={classes.formControl}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            label="从"
                            onChange={value => {
                                setStart(value)
                                writeToLocalSt({ key: 'start', value: value.getTime() })
                            }}
                            value={start}
                        ></KeyboardDatePicker>
                    </MuiPickersUtilsProvider>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            label="到"
                            onChange={value => {
                                setEnd(value)
                                writeToLocalSt({ key: 'end', value: value.getTime() })
                            }}
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