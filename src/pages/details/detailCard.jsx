import React from 'react';

import { Box, Card, CardContent, CardActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sortBy, compose, slice, prop, reverse, pick } from 'ramda';

const useStyles = makeStyles((theme) => ({
    root: {
        height: 100,
        padding: 0,
    },
    content: {
        padding: 8,
        height: 70,
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: 0,
        paddingTop: 0,
    },
    listitem: {
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },
    copy: {
        color: 'blue',
        cursor: 'pointer',
        float: 'right'
    }
}));

const headThree = compose(slice(0, 3), reverse, sortBy(prop('amount')));

const DetailCard = ({
    details,
    onClickShowAll = () => { },
    onClickCreate = () => { }
}) => {
    const classes = useStyles();

    return <Card className={classes.root}>
        <CardContent className={classes.content}>
            <Box>
                {
                    headThree(details).map((detail, index) => {
                        return <Box key={`listitem-${index}`} className={classes.listitem}>
                            {`¥${detail.amount / 100} @${detail.sourceAccountName} #${detail.subjectName}`}
                            <span className={classes.copy}>复制</span>
                        </Box>
                    })
                }
            </Box>
        </CardContent>
        <CardActions className={classes.actions}>
            <Box
                onClick={onClickShowAll(details)}>
                查看今天
            </Box>
            <Box
                onClick={onClickCreate}>
                添加一笔
            </Box>
        </CardActions>
    </Card>
};

export default DetailCard;