import React from 'react';

import { Card, CardContent, CardActions, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    }
});

const DetailCard = ({
    details
}) => {
    const classes = useStyles();

    return <Card>
        <CardContent>
            {details.map((detail, index) => {
                return <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {detail.amount}
                </Typography>
            })}
        </CardContent>
    </Card>
};

export default DetailCard;