import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, DateRangePicker, Form, Checkbox } from 'element-react';
import * as R from 'ramda';
import styles from './statistics.module.css';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';

function Statistics({
    statistics, accounts, users, subjects,
    loadStatistics, setDateRange, changeSubjects
}) {

    const load = () => {
        let toPass = statistics.subjects;
        if (toPass.length === 0) {
            toPass = subjects.content;
        }
        if (toPass.length === 0) {
            return;
        }
        const [start, end] = statistics.dateRange;
        loadStatistics({ start, end, subjects: toPass });
    };

    useEffect(() => {
        subjects.content.map(sub => sub.id).forEach(id => {
            changeSubjects({ id, action: "add" });
        });
        load();
    }, subjects);

    // 定义度量
    const cols = {
        subjectName: { alias: '科目' }, // 数据字段别名映射
        total: { alias: '金额' }
    };

    return (
        <div>
            <Form>
                <Form.Item label="科目">
                    <div className={styles.subjects}>
                        {subjects.content.map(subject => (
                            <Checkbox
                                onChange={checked => {
                                    if (checked) {
                                        changeSubjects({ id: subject.id, action: "add" });
                                    } else {
                                        changeSubjects({ id: subject.id, action: "remove" });
                                    }
                                    load();
                                }}
                                key={subject.id}
                                checked={statistics.subjects.indexOf(subject.id) !== -1}
                            >{subject.name}</Checkbox>)
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="日期范围">
                    <DateRangePicker
                        value={statistics.dateRange}
                        placeholder="选择日期范围"
                        onChange={date => {
                            setDateRange(date)
                        }}
                    ></DateRangePicker>
                </Form.Item>
                <Form.Item>
                    <Button
                        onClick={() => {
                            load()
                        }}
                        className={styles.query}
                        type="primary">
                        查询
                    </Button>
                </Form.Item>
            </Form>
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
                            <Geom type="interval" position="subjectName*total" color="subjectName" />
                        </Chart>
                        <div>支出{statistics.content.map(R.prop('total')).reduce((acc, cur) => acc + cur, 0)}元</div>
                    </div>
                )
            })()}
        </div>
    )

};

const mapState = R.pick(["accounts", "users", "statistics", 'subjects']);

const mapDispatch = dispatch => ({
    loadStatistics: dispatch.statistics.query,
    setDateRange: dispatch.statistics.setDateRange,
    changeSubjects: dispatch.statistics.changeSubjects
});

export default connect(mapState, mapDispatch)(Statistics);