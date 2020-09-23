import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
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
import Dayjs from 'dayjs'
import { useState } from 'react'
import DetailEdit from './detailEdit'
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import SubjectSelector from '../../comp/subjectSelector';
import AccountSelector from '../../comp/accountSelector';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import JizhangSelector from '../../comp/jizhangSelector';


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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function Details({
    details,
    loadDetails,
    loadUsers,
    loadSubjects,
    loadAccounts,
    delDetail,
    setEdittingDetail,
    showCreateDialog,
    showEditDialog,
    subjects
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
    const size = 10

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
            <TableCell>
                <div>
                    <Button
                        className={classes.opt}
                        size="small"
                        startIcon={<EditIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setEdittingDetail(data)
                            showEditDialog()
                        }}
                    >编辑</Button>
                    <Button
                        className={classes.opt}
                        size="small"
                        startIcon={<DeleteIcon />}
                        variant="contained"
                        color="secondary"
                        onClick={async () => {
                            setDeleteLoading(true)
                            await delDetail(data.id)
                            await load()
                            setDeleteLoading(false)
                        }}
                    >删除</Button>
                </div>
            </TableCell >
        )
    }

    const propsOfDetail = ['createdAt', 'username', 'amount', 'sourceAccountName', 'subjectName', 'destAccountName', 'remark', 'updatedAt', 'opt'];
    const tableHeaders = ['创建时间', '用户', '金额', '来源账户', '科目', '目标账户', '备注', '更新时间', '操作'];

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
                <AccountSelector
                    value={sourceAccountId}
                    onChange={setSourceAccountId}
                    title="来源账户"
                />
                <AccountSelector
                    value={destAccountId}
                    onChange={setDestAccountId}
                    title="目标账户"
                />
                <JizhangSelector
                    state={subjects}
                    title="科目"
                    multiple={true}
                    value={subjectIds}
                    onChange={setSubjectIds}
                />
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
                    <Button variant="contained" color="primary" onClick={load}>查询</Button>
                </FormControl>
                <FormControl className={classes.formControl}></FormControl>
                <Paper>
                    <TableContainer className={classes.container} component={Paper}>
                        <Table stickyHeader className={classes.table} aria-label="simple table" >
                            <TableHead>
                                <TableRow>
                                    {tableHeaders.map((item) => {
                                        return (<TableCell key={item}>{item}</TableCell>)
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
                                            } else {
                                                return <TableCell></TableCell>
                                            }
                                        }
                                        if (item === "opt") {
                                            return renderOperationButtons(detail)
                                        }
                                        return (<TableCell>{detail[item]}</TableCell>)
                                    })
                                }</TableRow>))
                            }</TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        onChangePage={(event, newPage) => {
                            console.log('event', event)
                            setPage(newPage)
                        }}
                        rowsPerPage={size}
                        page={page}
                        count={details.total} />
                </Paper>
                <DetailEdit></DetailEdit>
                <Backdrop className={classes.backdrop} open={initLoaidng}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Backdrop className={classes.backdrop} open={deleteLoading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div >
            <Fab aria-label="Add" className={classes.fab} color={"primary"} onClick={showCreateDialog}>
                <AddIcon />
            </Fab>
        </div >
    )

}

const mapState = R.pick(["accounts", "users", "details", 'subjects', 'detailEdit'])

const mapDispatch = dispatch => ({
    loadDetails: dispatch.details.load,
    loadUsers: dispatch.users.load,
    loadSubjects: dispatch.subjects.load,
    loadAccounts: dispatch.accounts.load,
    delDetail: dispatch.details.del,
    showCreateDialog: dispatch.detailEdit.showCreateDialog,
    showEditDialog: dispatch.detailEdit.showEditDialog,
    setEdittingDetail: dispatch.detailEdit.setForm
})

export default connect(mapState, mapDispatch)(Details)