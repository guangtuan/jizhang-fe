import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Fab, Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import JizhangCalendar from '../../comp/jizhangCalendar';

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

const defaultForm = () => ({
    id: undefined,
    amountLimit: undefined,
    dateBill: undefined,
    dateRepay: undefined
});

function CreditCards() {
    const classes = useStyles();

    const [form, setForm] = useState(defaultForm());

    return (
        <div>
            <Paper>
                <JizhangCalendar
                    line={4}
                    displayFunction={({ rowIndex, colIndex }) => { return <Box component='div'>{rowIndex + colIndex}</Box> }}
                ></JizhangCalendar>
            </Paper>
            <Fab aria-label="Add" className={classes.fab} color={'primary'} onClick={() => { }}>
                <AddIcon />
            </Fab>
        </div>
    );
};

export default CreditCards;
