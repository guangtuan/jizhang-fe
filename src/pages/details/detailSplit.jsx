import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    pick,
    clone,
    prop,
    append,
    last,
    over,
    lensIndex,
    dissoc,
    map,
    assoc,
    divide,
    compose,
    remove,
    length,
    dissocPath
} from 'ramda';
import {
    Dialog,
    Slide,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core';
import JizhangDateSelector from '../../comp/jizhangDateSelector';
import { model } from './model';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    formControl: {
        marginTop: theme.spacing(1),
        marginBotton: theme.spacing(1)
    },
}));

function DetailSplit({
    parent,
    dislogVisible,
    onClickCancel = () => { },
    afterSplit = () => { },
}) {
    const classes = useStyles();
    const [details, setDetails] = useState([]);
    const [totalAmount, setTotalAmount] = useState(undefined);
    const [parentId, setParentId] = useState(undefined);

    const setSplited = assoc('splited', 1);
    const removeId = dissoc('id');

    const toASplitedDetail = parentId => compose(assoc('parentId', parentId), setSplited, removeId);

    useEffect(() => {
        if (parent) {
            console.log('clone parent');
            const cloneForm = clone(parent);
            cloneForm.total = true;
            setTotalAmount(cloneForm.amount);
            setParentId(parent.id);
            compose(setDetails, map(toASplitedDetail(parentId)), append(cloneForm))(details);
        }
    }, [parent]);

    const defines = [
        {
            label: '记录日期',
            render: ({ detail, rowIndex, colIndex }) => {
                return <TableCell key={`createdAt-${rowIndex}-${colIndex}`}>
                    <JizhangDateSelector
                        key={`createdAt-select-${rowIndex}-${colIndex}`}
                        value={detail.createdAt}
                        setValue={date => {
                            compose(setDetails, over(lensIndex(rowIndex), assoc('createdAt', date)))(details);
                        }}
                    >
                    </JizhangDateSelector>
                </TableCell>
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
            label: '操作',
            render: ({ detail, rowIndex, colIndex }) => {
                const createEnable = rowIndex === length(details) - 1;
                const deleteEnable = length(details) > 1;
                return <TableCell key={`split-append-cell-${rowIndex}-${colIndex}`}>
                    <Button
                        disabled={!createEnable}
                        key={`split-append-button-${rowIndex}-${colIndex}`}
                        onClick={() => {
                            const setTotalFalse = assoc('total', false);
                            const newOne = compose(setTotalFalse, clone, last)(details);
                            const ava = divide(totalAmount, length(details) + 1);
                            const setAmount = assoc('amount', ava);
                            compose(setDetails, map(toASplitedDetail(parentId)), map(setAmount), append(newOne))(details);
                        }}
                    >添加</Button>
                    <Button
                        disabled={!deleteEnable}
                        key={`split-remove-button-${rowIndex}-${colIndex}`}
                        onClick={() => {
                            const indexToRemove = rowIndex;
                            const ava = divide(totalAmount, length(details) - 1);
                            const setAmount = assoc('amount', ava);
                            compose(setDetails, map(toASplitedDetail(parentId)), map(setAmount), remove(indexToRemove, 1))(details);
                        }}
                    >删除</Button>
                </TableCell>
            }
        }
    ];

    const label = prop('label');

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'lg'}
            open={dislogVisible}
            TransitionComponent={Transition}
        >
            <DialogTitle id="form-dialog-title">分摊</DialogTitle>
            <DialogContent>
                <Table stickyHeader className={classes.table}>
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
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onClickCancel}>取消</Button>
                <Button color="primary" onClick={async () => {
                    await model.createBatch(details);
                    afterSplit();
                }}>保存
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const mapState = pick([]);

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(DetailSplit);