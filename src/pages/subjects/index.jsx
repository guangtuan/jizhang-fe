import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { Table } from 'element-react';

function Subject({ subjects }) {

    const notEmpty = R.pipe(R.isEmpty, R.not);

    useEffect(() => {
    }, []);

    const columns = [
        {
            label: '标识',
            prop: 'key'
        },
        {
            label: '名称',
            prop: 'name'
        },
        {
            label: '描述',
            prop: 'desc'
        }
    ]

    return (
        <div>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={subjects}
                border={true}
                rowKey={R.prop('uuid')}
            />
        </div>
    )

};

const mapState = R.pick(["subjects"]);

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(Subject);