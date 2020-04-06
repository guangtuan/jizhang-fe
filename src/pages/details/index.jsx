import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Dialog, Form, Input, Select, DatePicker, Pagination, Loading } from 'element-react'
import * as R from 'ramda'
import styles from './details.module.css'
import Dayjs from 'dayjs'
import { useState } from 'react'
import DetailEdit from './detailEdit'

function Details({
    accounts, users, subjects,
    details, detailCreation,
    loadDetails, loadUsers, loadSubjects, loadAccounts, createDetail,
    showDialog, hideDialog, changeProperty,
    clear, delDetail,
    setEdittingDetail, showEditDialog
}) {

    const [initLoaidng, setInitLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [sourceAccountId, setSourceAccountId] = useState(null)
    const [destAccountId, setDestAccountId] = useState(null)
    const [subjectIds, setSubjectIds] = useState([])
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [page, setPage] = useState(1)
    const size = 15

    const load = async () => {
        console.log('load with', page)
        await loadDetails({
            page: page - 1,
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
                    type='primary'
                    onClick={() => {
                        setEdittingDetail(data)
                        showEditDialog()
                    }}
                >编辑</Button>
                <Button
                    type='danger'
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
            <Form inline>
                <Form.Item label="来源账户">
                    <Select
                        clearable={true}
                        value={sourceAccountId}
                        onChange={setSourceAccountId}
                        placeholder="请选择来源账户">
                        {(accounts || []).map(account => {
                            return <Select.Option key={account.id} label={account.name} value={account.id} />
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="目标账户">
                    <Select
                        clearable={true}
                        value={destAccountId}
                        onChange={setDestAccountId}
                        placeholder="请选择目标账户">
                        {(accounts || []).map(account => {
                            return <Select.Option key={account.id} label={account.name} value={account.id} />
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="科目">
                    <Select
                        multiple={true}
                        clearable={true}
                        value={subjectIds}
                        onChange={setSubjectIds}
                        placeholder="请选择科目">
                        {(subjects || []).map(subject => {
                            return <Select.Option key={subject.id} label={subject.name} value={subject.id} />
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="从">
                    <DatePicker
                        onChange={setStart}
                        value={start}
                    ></DatePicker>
                </Form.Item>
                <Form.Item label="到">
                    <DatePicker
                        onChange={setEnd}
                        value={end}
                    ></DatePicker>
                </Form.Item>
                <Button onClick={load}>查询</Button>
            </Form>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={details.content}
                border={true}
                rowKey={R.prop('id')}
            />
            <Pagination
                onCurrentChange={setPage}
                className={styles.page}
                layout="prev, pager, next"
                total={details.total} />
            <Button
                className={styles.add}
                type="primary"
                onClick={showDialog}>
                添加明细
            </Button>
            <Dialog
                title="添加明细"
                size="tiny"
                visible={detailCreation.dialogVisibility}
                onCancel={hideDialog}
                lockScroll={false}>
                <Dialog.Body>
                    <Form>
                        <Form.Item label="用户">
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
                        </Form.Item>
                        <Form.Item label="来源账户">
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
                        </Form.Item>
                        <Form.Item label="目标账户">
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
                        </Form.Item>
                        <Form.Item label="科目">
                            <Select
                                filterable={true}
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
                        </Form.Item>
                        <Form.Item>
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
                        </Form.Item>
                        <Form.Item>
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
                        </Form.Item>
                        <Form.Item label="消费日期">
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
                        </Form.Item>
                        <Form.Item>
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
                        </Form.Item>
                    </Form>
                </Dialog.Body>
            </Dialog>
            <Loading loading={deleteLoading}></Loading>
            <Loading loading={initLoaidng}></Loading>
            <DetailEdit></DetailEdit>
        </div>
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