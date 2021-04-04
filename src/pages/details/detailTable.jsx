import React from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import { map, prop, pick } from 'ramda';
import { connect } from 'react-redux';

import {
    TableCell,
    TableRow,
    TableHead,
    TableBody,
    TableContainer,
    Table,
    Button
} from '@material-ui/core';

import { KEY_MAP as detailDefine, OPT } from './detailDefine';

import { FileCopy as CopyIcon, Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

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

const getCellDefine = def => {
    switch (def) {
        case detailDefine.USERNAME:
            return {
                label: '用户',
                prop: 'username',
            }
        case detailDefine.SUBJECT:
            return {
                label: '科目',
                prop: 'subjectName',
            }
        case detailDefine.SRC_ACCOUNT:
            return {
                label: '来源账户',
                prop: 'sourceAccountName',
            }
        case detailDefine.DEST_ACCOUNT:
            return {
                label: '目标账户',
                prop: 'destAccountName',
            }
        case detailDefine.REMARK:
            return {
                label: '备注',
                prop: 'remark',
            }
        case detailDefine.AMOUNT:
            return {
                label: '金额',
                render: ({ detail, rowIndex, colIndex }) => {
                    const key = 'amount' + rowIndex + colIndex;
                    if (detail.amount) {
                        return <StyledTableCell key={key}>{`¥${detail.amount / 100}`}</StyledTableCell>
                    } else {
                        return <StyledTableCell key={key}></StyledTableCell>
                    }
                },
            }
    }
};

const getCellOptDefine = ({
    opts,
    classes,
    updateDetail,
    createDetail,
    hideDialog,
    showEditDialog,
    showCreateDialog,
    clearForm,
    setForm
}) => ({
    label: '操作',
    render: ({ detail, rowIndex, colIndex }) => {
        const key = 'amount' + rowIndex + colIndex;
        return <>
            {(() => {
                if (opts.includes(OPT.COPY)) {
                    return <Button
                        className={classes.opt}
                        size="small"
                        key={key + "copy"}
                        startIcon={<CopyIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setForm(detail);
                            showCreateDialog();
                        }}
                    >复制</Button>
                }
            })()}
            {(() => {
                if (opts.includes(OPT.EDIT)) {
                    return <Button
                        key={key + "copy"}
                        className={classes.opt}
                        size="small"
                        startIcon={<EditIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setForm(detail);
                            showEditDialog();
                        }}
                    >编辑</Button>
                }
            })()}
            {(() => {
                if (opts.includes(OPT.DEL)) {
                    return <Button
                        key={key + "del"}
                        className={classes.opt}
                        size="small"
                        startIcon={<DeleteIcon />}
                        variant="contained"
                        color="warning"
                        onClick={() => {
                        }}
                    >删除</Button>
                }
            })()}
        </>
    },
});

function DetailTable({
    details,
    properties,
    opts,
    updateDetail,
    createDetail,
    hideDialog,
    showEditDialog,
    showCreateDialog,
    clearForm,
    setForm
}) {

    const classes = useStyles();

    const cellDefine = map(getCellDefine)(properties);
    if (opts && opts.length > 0) {
        cellDefine.push(getCellOptDefine({
            opts,
            classes,
            updateDetail,
            createDetail,
            hideDialog,
            showEditDialog,
            showCreateDialog,
            clearForm,
            setForm
        }));
    }

    const getLabel = prop('label');

    const renderLine = (detail, rowIndex) => <StyledTableRow key={`detail-row-${rowIndex}`}>
        {
            cellDefine.map((def, colIndex) => {
                if (def.render) {
                    return def.render({ detail, rowIndex, colIndex });
                } else {
                    const key = def.prop + rowIndex + colIndex;
                    return <StyledTableCell key={key}>{detail[def.prop]}</StyledTableCell>;
                }
            })
        }
    </StyledTableRow>;

    return <TableContainer>
        <Table size="small" stickyHeader className={classes.table}>
            <TableHead>
                <StyledTableRow>
                    {cellDefine.map(getLabel).map((label, index) => <StyledTableCell key={label + index}>{label}</StyledTableCell>)}
                </StyledTableRow>
            </TableHead>
            <TableBody>{details.map(renderLine)}</TableBody>
        </Table>
    </TableContainer>

};

const mapState = pick(['detailEdit']);

const mapDispatch = dispatch => ({
    updateDetail: dispatch.detailEdit.update,
    createDetail: dispatch.detailEdit.create,
    hideDialog: dispatch.detailEdit.hideDialog,
    showEditDialog: dispatch.detailEdit.showEditDialog,
    showCreateDialog: dispatch.detailEdit.showCreateDialog,
    clearForm: dispatch.detailEdit.clearForm,
    setForm: dispatch.detailEdit.setForm,
});

export default connect(mapState, mapDispatch)(DetailTable);