import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Dialog, Form, Input, DatePicker, Loading } from 'element-react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import * as R from 'ramda'
import styles from './details.module.css'
import Dayjs from 'dayjs'
import { useState } from 'react'
import DetailEdit from './detailEdit'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function Details({
    accounts, users, subjects,
    details, detailCreation,
    loadDetails, loadUsers, loadSubjects, loadAccounts, createDetail,
    showDialog, hideDialog, changeProperty,
    clear, delDetail,
    setEdittingDetail, showEditDialog
}) {

    const classes = useStyles();

    const [initLoaidng, setInitLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [sourceAccountId, setSourceAccountId] = useState(undefined)
    const [destAccountId, setDestAccountId] = useState(undefined)
    const [subjectIds, setSubjectIds] = useState([])
    const [start, setStart] = useState(undefined)
    const [end, setEnd] = useState(undefined)
    const [page, setPage] = useState(0)
    const size = 15

    const load = async () => {
        console.log('load with', page)
        await loadDetails({
            page: page,
            size,
            queryParam: {
                sourceAccountId,
                destAccountId,
                start,
                end,
                subjectIds
            }
        })
    }

    const renderOperationButtons = function (data) {
        return (
            <div className={styles.opts}>
                <Button
                    variant="contained" color="primary"
                    onClick={() => {
                        setEdittingDetail(data)
                        showEditDialog()
                    }}
                >编辑</Button>
                <Button
                    variant="contained" color="secondary"
                    onClick={async () => {
                        setDeleteLoading(true)
                        await delDetail(data.id)
                        await load()
                        setDeleteLoading(false)
                    }}
                >删除</Button>
            </div>
        )
    }

    const propsOfDetail = ['username', 'sourceAccountName', 'subjectName', 'destAccountName', 'remark', 'amount', 'createdAt', 'updatedAt', 'opt'];
    const tableHeaders = ['用户', '来源账户', '科目', '目标账户', '备注', '金额', '创建时间', '更新时间', '操作'];

    const columns = [
        {
            label: '用户',
            prop: 'username'
        },
        {
            label: '来源账户',
            prop: 'sourceAccountName'
        },
        {
            label: '科目',
            prop: 'subjectName'
        },
        {
            label: '目标账户',
            prop: 'destAccountName'
        },
        {
            label: '备注',
            prop: 'remark'
        },
        {
            label: '金额',
            render: ({ amount }) => (<span>{amount / 100}元</span>)
        },
        {
            label: '创建时间',
            render: (data) => (<span>{Dayjs(data.createdAt).format("YYYY-MM-DD")}</span>)
        },
        {
            label: '更新时间',
            render: function (data) {
                if (data.updatedAt === null || data.updatedAt === undefined) {
                    return <span></span>
                } else {
                    return (
                        <span>
                            <span>{Dayjs(data.updatedAt).format("YYYY-MM-DD")}</span>
                        </span>
                    )
                }
            }
        },
        {
            label: '操作',
            render: renderOperationButtons
        }
    ]

    useEffect(() => {
        async function fetchdata() {
            setInitLoading(true)
            try {
                await Promise.all([
                    load(),
                    loadUsers(),
                    loadSubjects(),
                    loadAccounts()
                ])
            } catch (error) {
                console.log(error)
                setInitLoading(false)
            }
            setInitLoading(false)
        }
        fetchdata()
    }, [page])

    return (
        <div>
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel id="label_source_account">来源账户</InputLabel>
                    <Select
                        labelId="label_source_account"
                        value={sourceAccountId}
                        MenuProps={MenuProps}
                        onChange={(event) => setSourceAccountId(event.target.value)}
                        placeholder="请选择来源账户">
                        {
                            (accounts || []).map(account => {
                                return <MenuItem key={account.id} value={account.id} >{account.name}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>

                    <InputLabel id="label_desc_account">目标账户</InputLabel>
                    <Select
                        labelId="label_desc_account"
                        value={destAccountId}
                        MenuProps={MenuProps}
                        onChange={(event) => setDestAccountId(event.target.value)}
                        placeholder="请选择目标账户">
                        {(accounts || []).map(account => {
                            return <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel id="label_subject">科目</InputLabel>
                    <Select
                        labelId="label_subject"
                        multiple={true}
                        MenuProps={MenuProps}
                        value={subjectIds}
                        onChange={(event) => setSubjectIds(event.target.value)}
                        placeholder="请选择科目">
                        {(subjects || []).map(subject => {
                            return <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <DatePicker
                        onChange={setStart}
                        value={start}
                    ></DatePicker>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <DatePicker
                        onChange={setEnd}
                        value={end}
                    ></DatePicker>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={load}
                    >
                        查询
                    </Button>
                </FormControl>
                <FormControl className={classes.formControl}></FormControl>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table" >
                        <TableHead>
                            <TableRow>
                                {tableHeaders.map((item) => {
                                    return (<TableCell>{item}</TableCell>)
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>{
                            details.content.map(detail => (<TableRow>{
                                propsOfDetail.map((item) => {
                                    if (item === 'amount') {
                                        return (<TableCell>{detail[item] / 100}元</TableCell>)
                                    }
                                    if (item === "createdAt") {
                                        return (<TableCell>{Dayjs(detail[item]).format("YYYY-MM-DD")}</TableCell>)
                                    }
                                    if (item === "updatedAt") {
                                        if (detail[item]) {
                                            return (<TableCell>{Dayjs(detail[item]).format("YYYY-MM-DD")}</TableCell>)
                                        }
                                    }
                                    return (<TableCell>{detail[item]}</TableCell>)
                                })
                            }</TableRow>))
                        }</TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[15]}
                    component="div"
                    onChangePage={(event, newPage) => {
                        console.log('event', event)
                        setPage(newPage)
                    }}
                    rowsPerPage={size}
                    page={page}
                    className={styles.page}
                    count={details.total} />
                <Dialog
                    title="添加明细"
                    size="tiny"
                    visible={detailCreation.dialogVisibility}
                    onCancel={hideDialog}
                    lockScroll={false}>
                    <Dialog.Body>
                        <Select
                            value={detailCreation.userId}
                            onChange={val => {
                                changeProperty({
                                    key: 'userId',
                                    val: val
                                })
                            }}
                            placeholder="请选择用户">
                            {
                                (users || []).map(user => {
                                    return <Select.Option key={user.id} label={user.username} value={user.id} />
                                })
                            }
                        </Select>
                        <Select
                            value={detailCreation.sourceAccountId}
                            onChange={val => {
                                changeProperty({
                                    key: 'sourceAccountId',
                                    val: val
                                })
                            }}
                            placeholder="请选择来源账户">
                            {
                                (accounts || []).map(account => {
                                    return <Select.Option key={account.id} label={account.name} value={account.id} />
                                })
                            }
                        </Select>
                        <Select
                            value={detailCreation.destAccountId}
                            onChange={val => {
                                changeProperty({
                                    key: 'destAccountId',
                                    val: val
                                })
                            }}
                            placeholder="请选择目标账户">
                            {
                                (accounts || []).map(account => {
                                    return <Select.Option key={account.id} label={account.name} value={account.id} />
                                })
                            }
                        </Select>
                        <Select
                            value={detailCreation.subjectId}
                            onChange={val => {
                                changeProperty({
                                    key: 'subjectId',
                                    val: val
                                })
                            }}
                            placeholder="请选择科目">
                            {
                                (() => {
                                    if (subjects !== null && subjects.length !== 0) {
                                        return subjects.map(subject => {
                                            return <Select.Option key={subject.id} label={subject.name} value={subject.id} />
                                        })
                                    } else {
                                        return <div></div>
                                    }
                                })()
                            }
                        </Select>
                        <Input
                            value={detailCreation.amount}
                            placeholder="请输入金额（单位：元）"
                            onChange={val => {
                                changeProperty({
                                    key: 'amount',
                                    val: val
                                })
                            }}
                        ></Input>
                        <Input
                            value={detailCreation.remark}
                            placeholder="输入备注"
                            onChange={val => {
                                changeProperty({
                                    key: 'remark',
                                    val: val
                                })
                            }}
                        ></Input>
                        <DatePicker
                            value={detailCreation.createdAt}
                            placeholder="请选择消费日期"
                            onChange={date => {
                                changeProperty({
                                    key: 'createdAt',
                                    val: date
                                })
                            }}
                        />
                        <Button
                            onClick={() => {
                                const pack = R.pick(['userId', 'sourceAccountId', 'destAccountId', 'subjectId', 'remark', 'amount', 'createdAt'])(detailCreation)
                                pack.amount = pack.amount * 100
                                createDetail(pack).then(() => {
                                    clear()
                                    load()
                                })
                            }}
                        >确定</Button>
                    </Dialog.Body>
                </Dialog>
                <Loading loading={deleteLoading}></Loading>
                <Loading loading={initLoaidng}></Loading>
                <DetailEdit></DetailEdit>
            </div >
            <Fab aria-label="Add" className={classes.fab} color={"primary"} onClick={showDialog}>
                <AddIcon />
            </Fab>
        </div >
    )

}

const mapState = R.pick(["accounts", "users", "details", 'subjects', 'detailCreation'])

const mapDispatch = dispatch => ({
    loadDetails: dispatch.details.load,
    loadUsers: dispatch.users.load,
    loadSubjects: dispatch.subjects.load,
    loadAccounts: dispatch.accounts.load,
    createDetail: dispatch.details.create,
    delDetail: dispatch.details.del,
    showDialog: dispatch.detailCreation.showDialog,
    hideDialog: dispatch.detailCreation.hideDialog,
    showEditDialog: dispatch.detailEdit.showDialog,
    changeProperty: dispatch.detailCreation.changeProperty,
    clear: dispatch.detailCreation.clear,
    setEdittingDetail: dispatch.detailEdit.set
})

export default connect(mapState, mapDispatch)(Details)