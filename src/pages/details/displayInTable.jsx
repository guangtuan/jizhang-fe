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

import dayJs from 'dayjs';

const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650,
    },
    container: {
      maxHeight: 600,
    },
    opt: {
      margin: theme.spacing(1),
    },
  }));

const DisplayInTable = ({
    onClickEdit,
    onClickDelete,
    onChangePage,
    details,
    count,
    page,
    size
}) => {

    const classes = useStyles();

    const renderOperationButtons = function (data, rowIndex, colIndex) {
        const key = `${rowIndex}-${colIndex}`;
        return (
            <TableCell key={key}>
                <Button
                    className={classes.opt}
                    size="small"
                    startIcon={<EditIcon />}
                    variant="contained"
                    color="primary"
                    onClick={onClickEdit(data)}
                >编辑</Button>
                <Button
                    className={classes.opt}
                    size="small"
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    color="secondary"
                    onClick={onClickDelete(data)}
                >删除</Button>
            </TableCell>
        );
    };

    const propsOfDetail = ['createdAt', 'username', 'amount', 'sourceAccountName', 'subjectName', 'destAccountName', 'remark', 'updatedAt', 'opt'];
    const tableHeaders = ['创建时间', '用户', '金额', '来源账户', '科目', '目标账户', '备注', '更新时间', '操作'];

    return <Paper>
        <TableContainer className={classes.container} component={Paper}>
            <Table size="small" stickyHeader className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {tableHeaders.map((item) => {
                            return (<TableCell key={item}>{item}</TableCell>);
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>{
                    details.map((detail, rowIndex) => (<TableRow key={detail.id + detail.createdAt.toString()}>{
                        propsOfDetail.map((item, colIndex) => {
                            const key = `${rowIndex}-${colIndex}`;
                            if (item === 'amount') {
                                return (<TableCell key={key}>{detail[item] / 100}元</TableCell>);
                            }
                            if (item === 'createdAt') {
                                return (<TableCell key={key}>{dayJs(detail[item]).format('YYYY-MM-DD')}</TableCell>);
                            }
                            if (item === 'updatedAt') {
                                if (detail[item]) {
                                    return (<TableCell key={key}>{dayJs(detail[item]).format('YYYY-MM-DD')}</TableCell>);
                                } else {
                                    return <TableCell key={key} />;
                                }
                            }
                            if (item === 'opt') {
                                return renderOperationButtons(detail, rowIndex, colIndex);
                            }
                            return (<TableCell key={key}>{detail[item]}</TableCell>);
                        })
                    }</TableRow>))
                }</TableBody>
            </Table>
        </TableContainer>

        <TablePagination
            component="div"
            onChangePage={(event, newPage) => {
                onChangePage(newPage);
            }}
            rowsPerPage={size}
            page={page}
            count={count} />
    </Paper>;
}

export default DisplayInTable;