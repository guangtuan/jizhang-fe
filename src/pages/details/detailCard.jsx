import React from 'react';

import { Box, Card, CardContent, CardActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sortBy, compose, slice, prop, reverse } from 'ramda';

const useStyles = makeStyles(() => ({
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
        display: 'flex',
        justifyContent: 'space-between'
    },
    amount: {},
    account: {},
    subject: {},
    copy: {
        color: 'blue',
        cursor: 'pointer',
    }
}));

const headThree = compose(slice(0, 3), reverse, sortBy(prop('amount')));

const DetailCard = ({
    details,
    onClickShowAll = () => { },
    onClickCreate = () => { },
    onClickCopy = () => { },
}) => {
    const classes = useStyles();

    return <Card className={classes.root}>
        <CardContent className={classes.content}>
            <Box>
                {
                    headThree(details).map((detail, index) => {
                        const keyPrefix = 'detail-card-line';
                        return <Box key={`${keyPrefix}-${index}-${detail.id}`} className={classes.listitem}>
                            <span key={`${keyPrefix}-${index}-${detail.id}-amount`} className={classes.amount}>{`¥${detail.amount / 100}`}</span>
                            <span key={`${keyPrefix}-${index}-${detail.id}-account`} className={classes.account}>{`@${detail.sourceAccountName}`}</span>
                            <span key={`${keyPrefix}-${index}-${detail.id}-subject`} className={classes.subject}>{`#${detail.subjectName}`}</span>
                            <span key={`${keyPrefix}-${index}-${detail.id}-copy`} className={classes.copy} onClick={onClickCopy(detail)}>复制</span>
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