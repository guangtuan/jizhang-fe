import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { Table } from 'element-react';

function Details({ details }) {

    const columns = [
        {
            label: 'date',
            prop: 'date'
        },
        {
            label: 'user',
            prop: 'user'
        },
        {
            label: 'source',
            prop: 'source'
        },
        {
            label: 'dest',
            prop: 'dest'
        },
        {
            label: 'amount',
            prop: 'amount'
        }
    ]

    return (
        <div>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={details}
                border={true}
                rowKey={R.prop('uuid')}
            />
        </div>
    )

};

const mapState = R.pick(["details"]);

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(Details);