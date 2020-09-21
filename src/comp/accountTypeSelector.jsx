import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';

import { makeStyles } from '@material-ui/core/styles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
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

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
}));

function AccountTypeSelector({
    accountTypeDefine,
    title,
    onChange,
    value,
    multiple
}) {
    const classes = useStyles();
    const toSelectItem = accountType => <MenuItem key={accountType.value} value={accountType.value}>{accountType.name}</MenuItem>;
    return (
        <FormControl className={classes.formControl}>
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
        </FormControl>
    )
}

const mapState = R.pick(['accountTypeDefine']);

export default connect(mapState)(AccountTypeSelector);