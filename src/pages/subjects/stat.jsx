import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { post } from '../../core/request';
import { pick, map, prop, defaultTo, sum, compose, pipe, head } from 'ramda';
import dayjs from 'dayjs';
import SubjectSelector from '../../comp/subjectSelector';
import { makeStyles } from '@material-ui/core/styles';
import { subjectLevel } from '../../core/def';
import { writeToLocal, loadFromLocal } from '../../core/local';
import { FormControl, FormControlLabel, FormLabel, Radio, Paper, RadioGroup } from '@material-ui/core';
import JizhangDateSelector from '../../comp/jizhangDateSelector';
import { Chart, Line, Point, Tooltip, Legend } from 'bizcharts';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    formControlSubject: {
        width: 300,
        margin: theme.spacing(1),
    },
    header: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
    },
    chartBody: {
        marginTop: 16
    }
}));


function SubjectStat({
    subjects: globalSubjects,
}) {

    const classes = useStyles();
    const namespace = 'subjectStat';

    const [costs, setCosts] = useState([]);

    const loadFromLocalSt = loadFromLocal(namespace);
    const writeToLocalSt = writeToLocal(namespace);

    const [level, setLevel] = useState(pipe(
        loadFromLocalSt,
        Number.parseInt,
        defaultTo(subjectLevel.SMALL),
    )('level'));

    const [start, setStart] = useState(pipe(
        loadFromLocalSt,
        Number.parseFloat,
        defaultTo(dayjs().startOf('month').subtract(3, "month").toDate().getTime()),
    )('start'));

    const [end, setEnd] = useState(pipe(
        loadFromLocalSt,
        Number.parseFloat,
        defaultTo(dayjs().set('hour', 23).set('minute', 59).set('second', 59).toDate().getTime()),
    )('end'));

    const [subjectsSmall, setSubjectsSmall] = useState(pipe(
        loadFromLocalSt,
        JSON.parse,
        defaultTo(compose(map(prop('id')))(globalSubjects.flatedChildren)),
    )('subjectsSmall'));

    const [subjectsBig, setSubjectsBig] = useState(pipe(
        loadFromLocalSt,
        JSON.parse,
        defaultTo(compose(map(prop('id')))(globalSubjects.subjectTree)),
    )('subjectsBig'));

    const loadStatistics = async ({ start, end, ids }) => {
        const result = await post({
            path: `api/subjects/stat`,
            data: {
                ids,
                start,
                end,
                level
            }
        });
        console.log(result);
        setCosts(result);
    };

    useEffect(
        () => {
            if (level === subjectLevel.BIG) {
                loadStatistics({ start, end, ids: subjectsBig });
            } else {
                loadStatistics({ start, end, ids: subjectsSmall });
            }
        },
        [start, end, level, subjectsSmall, subjectsBig]
    );

    const scale = {
        cost: { min: 0 },
        display: {
            formatter: v => {
                return v;
            }
        }
    }

    return (
        <div>
            <Paper className={classes.header}>
                <FormControl className={classes.formControl} label="科目类型">
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
                        onChange={val => {
                            setSubjectsBig(val);
                            writeToLocalSt({ key: 'subjectsBig', value: JSON.stringify(val) })
                        }}
                    />
                }
                {
                    level === subjectLevel.SMALL && <SubjectSelector
                        value={subjectsSmall}
                        multiple={true}
                        onChange={val => {
                            setSubjectsSmall(val);
                            writeToLocalSt({ key: 'subjectsSmall', value: JSON.stringify(val) })
                        }}
                    />
                }
                <FormControl className={classes.formControl}>
                    <JizhangDateSelector
                        label={'选择开始日期'}
                        value={start}
                        setValue={val => setStart(val.getTime())}
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <JizhangDateSelector
                        label={'选择结束日期'}
                        value={end}
                        setValue={val => setEnd(val.getTime())}
                    />
                </FormControl>
            </Paper>


            {
                costs && costs.length > 0 &&
                <Chart scale={scale} padding={[30, 20, 60, 40]} autoFit height={320} data={costs} interactions={['element-active']}>
                    <Point position="display*cost" color="subjectName" shape='circle' />
                    <Line shape="smooth" position="display*cost" color="subjectName" label="cost" />
                    <Tooltip shared showCrosshairs />
                    <Legend background={{
                        padding: [5, 100, 5, 36],
                        style: {
                            fill: '#eaeaea',
                            stroke: '#fff'
                        }
                    }} />
                </Chart>
            }
        </div >
    );

};

const mapState = pick(['subjects']);

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(SubjectStat);