import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input, Select, DatePicker, Pagination } from 'element-react';
import * as R from 'ramda';
import styles from './statistics.module.css';
import Dayjs from 'dayjs';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';

function Statistics({
    statistics, accounts, users, subjects,
    loadStatistics
}) {

    useEffect(() => {
        loadStatistics();
    }, []);

    // 定义度量
    const cols = {
        subjectName: { alias: '科目' }, // 数据字段别名映射
        total: { alias: '金额' }
    };

    return (
        <div>
            <Chart width={1500} height={600} data={statistics.content} scale={cols}>
                {/* X 轴 */}
                <Axis name="subjectName" />
                {/* Y 轴 */}
                <Axis name="total" />
                <Legend position="top" dy={-20} />
                <Tooltip />
                <Geom type="interval" position="subjectName*total" color="subjectName" />
            </Chart>
            <Button
                className={styles.query}
                type="primary">
                查询
            </Button>
        </div>
    )

};

const mapState = R.pick(["accounts", "users", "statistics", 'subjects']);

const mapDispatch = dispatch => ({
    loadStatistics: dispatch.statistics.query
});

export default connect(mapState, mapDispatch)(Statistics);