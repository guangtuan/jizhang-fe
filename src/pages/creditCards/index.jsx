import { clone, propEq, groupBy, prop, compose, defaultTo, find } from 'ramda';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Fab, Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { model } from './model.js';

import JizhangCalendar from '../../comp/jizhangCalendar';
import DynamicFormDialog from '../../comp/dynamicFormDialog';

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    display: {
        margin: theme.spacing(1),
        height: 88,
    }
}));

const defaultForm = () => ({
    id: undefined,
    name: undefined,
    amountLimit: undefined,
    dateBill: undefined,
    dateRepay: undefined
});

function CreditCards() {
    const classes = useStyles();

    const [form, setForm] = useState(defaultForm());
    const [displayAsRepay, setDisplayAsRepay] = useState({});
    const [displayAsBill, setDisplayAsBill] = useState({});
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const init = async () => {
        const resp = await model.list();
        setDisplayAsRepay(groupBy(prop('dateRepay'))(resp));
        setDisplayAsBill(groupBy(prop('dateBill'))(resp));
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div>
            <Paper>
                <JizhangCalendar
                    line={4}
                    displayFunction={({ rowIndex, colIndex, dayObject }) => {
                        const date = dayObject.date();
                        return <Box className={classes.display}>
                            {defaultTo([])(displayAsBill[date]).map((card, index) => {
                                const key = `credit-card-unit-repay-${date}-${index}`;
                                return <Box key={key}>{`账单：${card.name}`}</Box>
                            })}
                            {defaultTo([])(displayAsRepay[date]).map((card, index) => {
                                const key = `credit-card-unit-repay-${date}-${index}`;
                                return <Box key={key}>{`还款：${card.name}`}</Box>
                            })}
                        </Box>
                    }}
                ></JizhangCalendar>
            </Paper>
            <Fab aria-label="Add" className={classes.fab} color={'primary'} onClick={() => {
                setShowCreateDialog(true);
            }}>
                <AddIcon />
            </Fab>
            <DynamicFormDialog
                title={"添加💳"}
                ifOpen={showCreateDialog}
                forms={[
                    {
                        type: DynamicFormDialog.FORM_TYPE.TEXT,
                        key: 'name',
                        label: '名称备注',
                    },
                    {
                        type: DynamicFormDialog.FORM_TYPE.NUMBER,
                        key: 'amountLimit',
                        label: '额度',
                    },
                    {
                        type: DynamicFormDialog.FORM_TYPE.NUMBER,
                        key: 'dateRepay',
                        label: '账单日',
                    },
                    {
                        type: DynamicFormDialog.FORM_TYPE.NUMBER,
                        key: 'dateBill',
                        label: '还款日',
                    },
                ]}
                formData={form}
                onClickCancel={() => { setShowCreateDialog(false) }}
                onClickOK={async () => {
                    setShowCreateDialog(false);
                    const data = clone(form)
                    await model.create(data);
                    setForm(defaultForm());
                    await init();
                }}
            ></DynamicFormDialog>
        </div >
    );
};

export default CreditCards;
