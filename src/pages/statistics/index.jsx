import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import * as R from 'ramda';
import {Axis, Chart, Geom, Label, Legend, Tooltip} from 'bizcharts';
import SubjectSelector from '../../comp/subjectSelector';
import {KeyboardDatePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import {FormControl} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {makeStyles} from '@material-ui/core/styles';
import dayjs from 'dayjs';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
}));

function Statistics({
    accounts, users, loadStatistics, statistics,
}) {

    const classes = useStyles();

    const [start, setStart] = useState(dayjs().startOf('month').toDate().getTime());
    const [end, setEnd] = useState(dayjs().set('hour', 23).set('minute', 59).set('second', 59).toDate().getTime());
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        loadStatistics({ start, end, subjects });
    }, [start, end, subjects]);

    // 定义度量
    const cols = {
        subjectName: { alias: '科目' }, // 数据字段别名映射
        total: { alias: '金额' }
    };

    return (
        <div>
            <SubjectSelector
              title={"筛选科目"}
              value={subjects}
              multiple={true}
              onChaneg={setSubjects}
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
            {(() => {
                if (statistics.content.length === 0) {
                    return <div></div>
                }
                return (
                    <div>
                        <Chart width={1400} height={600} data={statistics.content} scale={cols}>
                            {/* X 轴 */}
                            <Axis name="subjectName" />
                            {/* Y 轴 */}
                            <Axis name="total" />
                            <Legend position="top" dy={-20} />
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

const mapState = R.pick(["accounts", "users", "statistics"]);

const mapDispatch = dispatch => ({
    loadStatistics: dispatch.statistics.query
});

export default connect(mapState, mapDispatch)(Statistics);