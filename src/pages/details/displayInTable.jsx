import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Button
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import dayJs from 'dayjs';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 600,
    },
    container: {
        maxHeight: 700
    },
    opt: {
        margin: theme.spacing(1),
    },
}));

const DisplayInTable = ({
    onClickEdit,
    onClickDelete,
    onClickCopy,
    onChangePage,
    details,
    count,
    page,
    size
}) => {

    const classes = useStyles();

    const defines = [
        {
            label: '创建时间',
            render: ({ detail, rowIndex, colIndex }) => {
                const key = 'createdAt' + rowIndex + colIndex;
                if (detail.createdAt) {
                    return <TableCell key={key}>{dayJs(detail.createdAt).format('YYYY-MM-DD')}</TableCell>
                } else {
                    return <TableCell key={key}></TableCell>
                }
            }
        },
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
        {
            label: '更新时间',
            render: ({ detail, rowIndex, colIndex }) => {
                const key = 'updatedAt' + rowIndex + colIndex;
                if (detail.updatedAt) {
                    return <TableCell key={key}>{dayJs(detail.updatedAt).format('YYYY-MM-DD')}</TableCell>
                } else {
                    return <TableCell key={key}></TableCell>
                }
            }
        },
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
                            onClick={onClickCopy(detail)}
                        >复制</Button>
                        <Button
                            className={classes.opt}
                            size="small"
                            startIcon={<EditIcon />}
                            variant="contained"
                            color="primary"
                            onClick={onClickEdit(detail)}
                        >编辑</Button>
                        <Button
                            className={classes.opt}
                            size="small"
                            startIcon={<DeleteIcon />}
                            variant="contained"
                            color="secondary"
                            onClick={onClickDelete(detail)}
                        >删除</Button>
                    </TableCell>
                );
            }
        }
    ];

    return <Paper>
        <TableContainer className={classes.container} component={Paper}>
            <Table size="small" stickyHeader className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {defines.map((item) => {
                            return (<TableCell key={`header${item.label}`}>{item.label}</TableCell>);
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
            <TablePagination
                component="div"
                onChangePage={(event, newPage) => {
                    onChangePage(newPage);
                }}
                rowsPerPage={size}
                page={page}
                count={count}
            />
        </TableContainer>
    </Paper>;
}

export default DisplayInTable;