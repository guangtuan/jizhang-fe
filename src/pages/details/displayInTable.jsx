import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import {
    pick,
    equals,
    prop,
    not,
    compose
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
    FormControl,
} from '@material-ui/core';

import CallSplitIcon from '@material-ui/icons/CallSplit';

import DetailSplit from './detailSplit';

import AccountSelector from '../../comp/accountSelector';
import SubjectSelector from '../../comp/subjectSelector';
import JizhangDateSelector from '../../comp/jizhangDateSelector';

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
    formControl: {
        width: 200,
        margin: theme.spacing(1),
    },
    formControlSubject: {
        width: 300,
        margin: theme.spacing(1),
    }
}));

const DisplayInTable = ({
    loadDetails,
    details,
    count,
    subjects
}) => {

    const classes = useStyles();

    const [sourceAccountId, setSourceAccountId] = useState(undefined);
    const [destAccountId, setDestAccountId] = useState(undefined);
    const [subjectIds, setSubjectIds] = useState([]);
    const [start, setStart] = useState(new Date(dayJs(new Date()).startOf('month').valueOf()));
    const [end, setEnd] = useState(new Date(dayJs(new Date()).endOf('month').valueOf()));
    const [page, setPage] = useState(0);
    const [splitDialogVisible, setSplitDialogVisible] = useState(false);
    const [detailToSplit, setDetailToSplit] = useState();
    const size = 10;

    const load = async () => {
        loadDetails({
            page: 0,
            size: 10,
            queryParam: {
                start,
                end,
                subjectIds,
                sourceAccountId,
                destAccountId
            }
        });
    }

    useEffect(
        () => {
            load();
        },
        [start, end, subjectIds, sourceAccountId, destAccountId, page]
    );

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
                            disabled={compose(not, equals(0), prop('splited'))(detail)}
                            className={classes.opt}
                            size="small"
                            startIcon={<CallSplitIcon />}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setDetailToSplit(detail);
                                setSplitDialogVisible(true);
                            }}
                        >分摊</Button>
                    </TableCell>
                );
            }
        }
    ];

    return <Box>
        <Box>
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
            <FormControl className={classes.formControlSubject}>
                <SubjectSelector
                    state={subjects.list}
                    title="科目"
                    multiple={true}
                    value={subjectIds}
                    onChange={setSubjectIds}
                />
            </FormControl>
            <FormControl className={classes.formControl}>
                <JizhangDateSelector
                    label={"从"}
                    value={start}
                    setValue={setStart}>
                </JizhangDateSelector>
            </FormControl>
            <FormControl className={classes.formControl}>
                <JizhangDateSelector
                    label={"到"}
                    value={end}
                    setValue={setEnd}>
                </JizhangDateSelector>
            </FormControl>
        </Box>
        <TableContainer className={classes.container} component={Paper}>
            <Table size="small" stickyHeader className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {defines.map((item) => <TableCell key={`header${item.label}`}>{item.label}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        details.content.map((detail, rowIndex) => (
                            <TableRow key={`detail-row-${rowIndex}`}>
                                {
                                    defines.map((def, colIndex) => {
                                        if (def.render) {
                                            return def.render({ detail, rowIndex, colIndex });
                                        } else {
                                            return <TableCell key={def.prop + rowIndex + colIndex}>{detail[def.prop]}</TableCell>;
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
                rowsPerPage={size}
                page={page}
                count={details.total}
            />
        </TableContainer>
        <DetailSplit
            parent={detailToSplit}
            dislogVisible={splitDialogVisible}
            afterSplit={() => {
                setSplitDialogVisible(false);
                // TODO set parent to a splited parent
                load();
            }}
            onClickCancel={() => {
                setSplitDialogVisible(false);
            }}
        ></DetailSplit>
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
