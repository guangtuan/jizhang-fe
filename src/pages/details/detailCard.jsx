import React from 'react';

import { Card, CardContent, Box, CardActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sortBy, compose, slice, prop, reverse } from 'ramda';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 176,
        height: 100,
        padding: 0,
    },
    content: {
        paddingTop: 4,
        paddingBottom: 0,
        paddingLeft: 16,
        paddingRight: 16,
        height: 70,
    },
    title: {
        textAlign: 'left',
        fontSize: 14,
    },
    actions: {
        paddingBottom: 0,
        paddingTop: 0,
    }
}));

const headThree = compose(slice(0, 3), reverse, sortBy(prop('amount')));

const displayAll = (details) => {

};

const DetailCard = ({
    details,
    date
}) => {
    const classes = useStyles();

    return <Card className={classes.root}>
        <CardContent className={classes.content}>
            {
                headThree(details).map((detail, index) => {
                    return <Box className={classes.title} color="textSecondary">
                        {`${detail.subjectName}: ¥${detail.amount / 100}`}
                    </Box>
                })
            }
        </CardContent>
        <CardActions className={classes.actions}>
            <Button
                onClick={displayAll(details)}
                size="small">
                查看全部
                </Button>
            <Button
                onClick={() => { }}
                size="small"
                color="primary">
                添加一笔
                </Button>
        </CardActions>
    </Card>
};

export default DetailCard;