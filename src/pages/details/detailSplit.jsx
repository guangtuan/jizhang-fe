import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { pick, clone, prop, append } from 'ramda';
import { makeStyles } from '@material-ui/core/styles';
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
import dayJs from 'dayjs';


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
    base,
    dislogVisible,
    onClickCancel = () => { },
    afterSplit = () => { },
}) {
    const classes = useStyles();
    const [userId, setUserId] = useState(undefined);
    const [sourceAccountId, setSourceAccountId] = useState(undefined);
    const [destAccountId, setDestAccountId] = useState(undefined);
    const [subjectId, setSubjectId] = useState(undefined);
    const [amount, setAmount] = useState(undefined);
    const [remark, setRemark] = useState(undefined);
    const [createdAt, setCreatedAt] = useState(undefined);
    const [cloneForm, setCloneForm] = useState(undefined);
    const [details, setDetails] = useState([]);

    useEffect(() => {
        if (base) {
            const cloneForm = clone(base);
            setDetails(append(cloneForm)(details));
            // setUserId(cloneForm.userId);
            // setSourceAccountId(cloneForm.sourceAccountId);
            // setDestAccountId(cloneForm.destAccountId);
            // setSubjectId(cloneForm.subjectId);
            // setAmount(cloneForm.amount);
            // setRemark(cloneForm.remark);
            // setCreatedAt(cloneForm.createdAt);
        }
    }, [base]);

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
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onClickCancel}>取消</Button>
                <Button color="primary" onClick={() => {

                }}>保存
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const mapState = pick([]);

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(DetailSplit);