import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import {
    pick,
    defaultTo
} from 'ramda';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Box,
    Button,
    Switch,
    FormControl,
    FormControlLabel,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import AccountSelector from '../../comp/accountSelector';
import SubjectSelector from '../../comp/subjectSelector';

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
    displayInCalendar = false,
    setDisplayInCalendar,
    onClickEdit,
    onClickDelete,
    onClickCopy,
    onChangePage,
    details,
    count,
    subjects,
    onClickQuery = () => { }
}) => {

    const classes = useStyles();

    const [sourceAccountId, setSourceAccountId] = useState(undefined);
    const [destAccountId, setDestAccountId] = useState(undefined);
    const [subjectIds, setSubjectIds] = useState([]);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [page, setPage] = useState(0);
    const size = 10;

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

    return <Box>
        <Box>
            <FormControlLabel
                className={classes.controlSwitch}
                control={
                    <Switch
                        checked={displayInCalendar}
                        onChange={() => {
                            setDisplayInCalendar(!displayInCalendar)
                        }}
                        name="displayInCalendar"
                        color="primary"
                    />
                }
                label="以📅形式展示"
            />
            <FormControl className={classes.formControl}>
                <AccountSelector
                    value={sourceAccountId}
                    onChange={setSourceAccountId}
                    title="来源账户"
                />
            </FormControl>
            <FormControl className={classes.formControl}>
                <AccountSelector
                    value={destAccountId}
                    onChange={setDestAccountId}
                    title="目标账户"
                />
            </FormControl>
            <FormControl className={classes.formControl}>
                <SubjectSelector
                    state={subjects.list}
                    title="科目"
                    multiple={true}
                    value={subjectIds}
                    onChange={setSubjectIds}
                />
            </FormControl>
            <FormControl className={classes.formControl}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        label="从"
                        onChange={setStart}
                        value={start}
                    ></KeyboardDatePicker>
                </MuiPickersUtilsProvider>
            </FormControl>
            <FormControl className={classes.formControl}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        label="到"
                        onChange={setEnd}
                        value={end}
                    ></KeyboardDatePicker>
                </MuiPickersUtilsProvider>
            </FormControl>
            <FormControl className={classes.formControl}>
                <Button variant="contained" color="primary" onClick={onClickQuery}>查询</Button>
            </FormControl>
        </Box>
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
    </Box>;
}

const mapState = pick(['accounts', 'users', 'details', 'subjects', 'detailEdit']);

const mapDispatch = (dispatch) => ({
    loadDetails: dispatch.details.load,
    delDetail: dispatch.details.del,
    showCreateDialog: dispatch.detailEdit.showCreateDialog,
    showEditDialog: dispatch.detailEdit.showEditDialog,
    setEdittingDetail: dispatch.detailEdit.setForm,
});

export default connect(mapState, mapDispatch)(DisplayInTable);
