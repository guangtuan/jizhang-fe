import React from 'react';
import {
    __,
    concat,
    ifElse,
    identity,
    prop,
    compose,
    defaultTo,
    isNil,
    any
} from 'ramda';

import { makeStyles } from '@material-ui/core/styles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const emptyItem = () => [{
    id: undefined,
    name: "清空"
}];

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

export default function JizhangSelector({
    display = prop('name'),
    id = prop('id'),
    clearable = true,
    state,
    title,
    onChange,
    value,
    multiple
}) {
    const classes = useStyles();
    const toSelectItem = datum => <MenuItem key={id(datum)} value={id(datum)}>{display(datum)}</MenuItem>;
    return (
        <FormControl className={classes.formControl}>
            <InputLabel>{title}</InputLabel>
            <Select
                multiple={!!multiple}
                MenuProps={MenuProps}
                value={value}
                onChange={event => {
                    const val = compose(
                        prop('value'),
                        prop('target')
                    )(event)
                    onChange(
                        ifElse(
                            () => multiple,
                            ifElse(any(isNil), () => [], identity),
                            identity
                        )(val)
                    )
                }}>
                {ifElse(() => clearable, concat(__, emptyItem()), compose(defaultTo([]), identity))(state).map(toSelectItem)}
            </Select>
        </FormControl>
    );
}