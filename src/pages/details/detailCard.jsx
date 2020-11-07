import React from 'react';

import { List, ListItem, Typography, Box, Card, CardContent, CardActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sortBy, compose, slice, prop, reverse, pick } from 'ramda';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 176,
        height: 100,
        padding: 0,
    },
    content: {
        paddingTop: 4,
        paddingBottom: 0,
        paddingLeft: 8,
        paddingRight: 8,
        height: 70,
    },
    title: {
        textAlign: 'left',
        fontSize: 14,
    },
    actions: {
        paddingBottom: 0,
        paddingTop: 0,
    },
    listitem: {
        paddingBottom: 0,
        paddingTop: 0,
    }
}));

const headThree = compose(slice(0, 3), reverse, sortBy(prop('amount')));

const DetailCard = ({
    details,
    date,
    onClickShowAll = () => { },
    onClickCreate = () => { }
}) => {
    const classes = useStyles();

    return <Card className={classes.root}>
        <CardContent className={classes.content}>
            <List>
                {
                    headThree(details).map((detail, index) => {
                        return <ListItem className={classes.listitem}>
                            <Box component="div" className={classes.listitem}>
                                {`${detail.subjectName}: ¥${detail.amount / 100}`}
                            </Box>
                        </ListItem>
                    })
                }
            </List>
        </CardContent>
        <CardActions className={classes.actions}>
            <Button
                onClick={onClickShowAll(details)}
                size="small">
                查看全部
                </Button>
            <Button
                onClick={onClickCreate(date)}
                size="small"
                color="primary">
                添加一笔
                </Button>
        </CardActions>
    </Card>
};

export default DetailCard;