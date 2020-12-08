import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    FileCopy as FileCopyIcon
} from '@material-ui/icons/';
import dayJs from 'dayjs';
import {
    Dialog,
    Slide,
    Button,
    TextField,
    FormControl,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItem,
    Chip,
    Table,
    TableBody,
    TableContainer,
    TableCell,
    TableRow,
    TableHead,
} from '@material-ui/core';
import { prop } from 'ramda';

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


export default function Today({
    dateStr,
    show,
    details,
    onClockClose
}) {

    const classes = useStyles();
    const defines = [
        // {
        //     label: '创建时间',
        //     render: ({ detail, rowIndex, colIndex }) => {
        //         const key = 'createdAt' + rowIndex + colIndex;
        //         if (detail.createdAt) {
        //             return <TableCell key={key}>{dayJs(detail.createdAt).format('YYYY-MM-DD')}</TableCell>
        //         } else {
        //             return <TableCell key={key}></TableCell>
        //         }
        //     }
        // },
        {
            label: '用户',
            prop: 'username',
        },
        {
            label: '金额',
            render: ({ detail, rowIndex, colIndex }) => {
                const key = 'amount' + rowIndex + colIndex;
                if (detail.createdAt) {
                    return <TableCell key={key}>{`¥${detail.amount / 100}`}</TableCell>
                } else {
                    return <TableCell key={key}></TableCell>
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
        // {
        //     label: '更新时间',
        //     render: ({ detail, rowIndex, colIndex }) => {
        //         const key = 'updatedAt' + rowIndex + colIndex;
        //         if (detail.updatedAt) {
        //             return <TableCell key={key}>{dayJs(detail.updatedAt).format('YYYY-MM-DD')}</TableCell>
        //         } else {
        //             return <TableCell key={key}></TableCell>
        //         }
        //     }
        // },
        {
            label: '操作',
            render: ({ detail, rowIndex, colIndex }) => {
                const key = `opt-${rowIndex}-${colIndex}`;
                return (
                    <TableCell key={key}>
                        <Button
                            className={classes.opt}
                            size="small"
                            startIcon={<FileCopyIcon />}
                            variant="contained"
                            onClick={() => { }}
                        >复制</Button>
                        <Button
                            className={classes.opt}
                            size="small"
                            startIcon={<EditIcon />}
                            variant="contained"
                            color="primary"
                            onClick={() => { }}
                        >编辑</Button>
                        <Button
                            className={classes.opt}
                            size="small"
                            startIcon={<DeleteIcon />}
                            variant="contained"
                            color="secondary"
                            onClick={() => { }}
                        >删除</Button>
                    </TableCell>
                );
            }
        }
    ];

    const label = prop('label');

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
                        <TableRow>
                            {defines.map(label).map((l, index) => {
                                return <TableCell>{l}</TableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            details.map((detail, rowIndex) => (
                                <TableRow key={`detail-row-${rowIndex}`}>
                                    {
                                        defines.map((def, colIndex) => {
                                            if (def.render) {
                                                return def.render({ detail, rowIndex, colIndex });
                                            } else {
                                                const key = def.prop + rowIndex + colIndex;
                                                return <TableCell key={key}>{detail[def.prop]}</TableCell>;
                                            }
                                        })
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
        <DialogActions>
            <Button color="secondary" onClick={onClockClose}>关闭</Button>
        </DialogActions>
    </Dialog>

}