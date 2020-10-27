import React from 'react';

import { Card, CardContent, CardActions, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        minWidth: 150,
    },
    title: {
        fontSize: 14,
    }
});

const DetailCard = ({
    details
}) => {
    const classes = useStyles();

    return <Card className={classes.root}>
        <CardContent>
            {details.map((detail, index) => {
                return <div className={classes.title} color="textSecondary" gutterBottom>
                    {`${detail.subjectName}: ¥${detail.amount / 100}`}
                </div>
            })}
        </CardContent>
    </Card>
};

export default DetailCard;