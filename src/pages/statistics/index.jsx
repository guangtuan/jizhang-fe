import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, DateRangePicker, Form, Checkbox } from 'element-react';
import * as R from 'ramda';
import styles from './statistics.module.css';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';

function Statistics({
    statistics, accounts, users, subjects,
    loadStatistics, setDateRange
}) {

    useEffect(() => {
        const [start, end] = statistics.dateRange.map(d => d.getTime());
        loadStatistics({ start, end });
    }, []);

    // 定义度量
    const cols = {
        subjectName: { alias: '科目' }, // 数据字段别名映射
        total: { alias: '金额' }
    };

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
            <br></br>
            <Form>
                <Form.Item>
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
                            const [start, end] = statistics.dateRange.map(d => d.getTime());
                            loadStatistics({ start, end });
                        }}
                        className={styles.query}
                        type="primary">
                        查询
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )

};

const mapState = R.pick(["accounts", "users", "statistics", 'subjects']);

const mapDispatch = dispatch => ({
    loadStatistics: dispatch.statistics.query,
    setDateRange: dispatch.statistics.setDateRange
});

export default connect(mapState, mapDispatch)(Statistics);