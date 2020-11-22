import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function AccountTypeSelector({
    accountTypeDefine,
    title,
    onChange,
    value,
    multiple
}) {
    const toSelectItem = accountType => <MenuItem key={accountType.value} value={accountType.value}>{accountType.name}</MenuItem>;
    return (
        <>
            <InputLabel>{title}</InputLabel>
            <Select
                multiple={!!multiple}
                MenuProps={MenuProps}
                value={value}
                onChange={event => {
                    const val = event.target.value
                    if (!multiple) {
                        onChange(val)
                        return
                    }
                    if (val.some(id => id === undefined)) {
                        onChange([])
                        return
                    }
                    onChange(val)
                }}>
                {accountTypeDefine.map(toSelectItem)}
            </Select>
        </>
    )
}

const mapState = R.pick(['accountTypeDefine']);

export default connect(mapState)(AccountTypeSelector);