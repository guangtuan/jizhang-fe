import React from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Dialog,
    Slide,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableContainer,
    TableCell,
    TableRow,
    TableHead,
} from '@material-ui/core';
import { prop, sortWith, descend, ascend } from 'ramda';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 600,
    },
    opt: {
        margin: theme.spacing(1),
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

export default function Today({
    dateStr,
    show,
    details,
    onClickClose = () => { },
    onClickEdit = () => { },
    onClickDelete = () => { },
    onClickCopy = () => { },
}) {

    const classes = useStyles();
    const defines = [
        {
            label: '用户',
            prop: 'username',
        },
        {
            label: '金额',
            render: ({ detail, rowIndex, colIndex }) => {
                const key = 'amount' + rowIndex + colIndex;
                if (detail.amount) {
                    return <StyledTableCell key={key}>{`¥${detail.amount / 100}`}</StyledTableCell>
                } else {
                    return <StyledTableCell key={key}></StyledTableCell>
                }
            }
        },
        {
            label: '来源账户',
            prop: 'sourceAccountName',
        },
        {
            label: '目标账户',
            prop: 'destAccountName',
        },
        {
            label: '科目',
            prop: 'subjectName',
        },
        {
            label: '备注',
            prop: 'remark',
        },
    ];

    const label = prop('label');

    const renderLine = (detail, rowIndex) => (
        <StyledTableRow key={`detail-row-${rowIndex}`}>
            {
                defines.map((def, colIndex) => {
                    if (def.render) {
                        return def.render({ detail, rowIndex, colIndex });
                    } else {
                        const key = def.prop + rowIndex + colIndex;
                        return <StyledTableCell key={key}>{detail[def.prop]}</StyledTableCell>;
                    }
                })
            }
        </StyledTableRow>
    );

    return <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        TransitionComponent={Transition}
        open={show}
    >
        <DialogTitle id="today-dialog-title">{dateStr}</DialogTitle>
        <DialogContent>
            <TableContainer>
                <Table size="small" stickyHeader className={classes.table}>
                    <TableHead>
                        <StyledTableRow>
                            {defines.map(label).map((l, index) => {
                                return <StyledTableCell>{l}</StyledTableCell>
                            })}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>{sortWith([descend(prop('amount'))])(details).map(renderLine)}</TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
        <DialogActions>
            <Button color="secondary" onClick={onClickClose}>关闭</Button>
        </DialogActions>
    </Dialog>

}