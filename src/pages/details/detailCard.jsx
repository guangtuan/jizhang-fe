import React from 'react';

import { Box, Button, Card, CardContent, CardActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { compose, prop, sum, map, divide, __, length, gt } from 'ramda';

const useStyles = makeStyles((theme) => ({
    root: {
        height: 84,
        padding: 0,
    },
    content: {
        padding: 8,
        height: 56,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: 0,
        paddingTop: 0,
    },
    total: {
        fontSize: 22,
        color: theme.palette.text.primary
    }
}));

const twoDecimal = num => (Math.round(num * 100) / 100).toFixed(2);
const renderAmount = compose(s => `¥${s}`, twoDecimal, divide(__, 100));
const total = compose(renderAmount, sum, map(prop('amount')));
const arrayNotEmpty = compose(gt(__, 0), length);

const DetailCard = ({
    details,
    onClickShowAll = () => { },
    onClickCreate = () => { },
}) => {
    const classes = useStyles();

    return <Card className={classes.root}>
        <CardContent className={classes.content}>
            <Box className={classes.total}>
                {arrayNotEmpty(details) ? total(details) : <div></div>}
            </Box>
        </CardContent>
        <CardActions className={classes.actions}>
            <Button
                color="primary"
                size='small'
                onClick={onClickShowAll(details)}>
                today
            </Button>
            <Button
                color="secondary"
                size='small'
                onClick={onClickCreate}>
                create
            </Button>
        </CardActions>
    </Card>
};

export default DetailCard;