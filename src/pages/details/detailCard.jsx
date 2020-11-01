import React from 'react';

import { Card, CardContent, CardActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { gt, length, compose, ifElse, slice } from 'ramda';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 176,
        height: 88,
        padding: 0,
    },
    content: {
        padding: 8,
    },
    title: {
        textAlign: 'left',
        fontSize: 14,
    },
    clickShowMore: {
        margin: 0,
        padding: 0,
        justifyContent: 'start'
    }
}));

const moreThanThree = compose(gt(3), length);
const headTwo = slice(0, 2);

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
                ifElse(
                    moreThanThree,
                    () => {
                        return details.map((detail, index) => {
                            return <div className={classes.title} color="textSecondary">
                                {`${detail.subjectName}: ¥${detail.amount / 100}`}
                            </div>
                        })
                    },
                    () => {
                        return <React.Fragment>
                            {
                                headTwo(details).map((detail, index) => {
                                    return <div className={classes.title} color="textSecondary">
                                        {`${detail.subjectName}: ¥${detail.amount / 100}`}
                                    </div>
                                })
                            }
                            <Button
                                onClick={displayAll(details)}
                                size="small"
                                color="primary"
                                className={classes.clickShowMore}>
                                查看更多
                            </Button>
                        </React.Fragment>
                    }
                )(details)
            }
        </CardContent>
    </Card>
};

export default DetailCard;