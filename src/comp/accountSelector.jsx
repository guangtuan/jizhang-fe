import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';

import { makeStyles } from '@material-ui/core/styles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const emptyItem = () => ({
    id: undefined,
    name: "清空"
});

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

function AccountSelector({
    accounts,
    title,
    onChange,
    value,
    multiple
}) {
    const classes = useStyles();
    const toSelect = R.concat([emptyItem()], accounts);
    const toSelectItem = account => <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>;
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
                {toSelect.map(toSelectItem)}
            </Select>
        </FormControl>
    )
}

const mapState = R.pick(['accounts']);

export default connect(mapState)(AccountSelector);