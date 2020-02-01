import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input, Select, DatePicker, Pagination, Loading } from 'element-react';
import * as R from 'ramda';
import styles from './details.module.css';
import Dayjs from 'dayjs';
import { useState } from 'react';
import DetailEdit from './detailEdit';

function Details({
    accounts, users, subjects,
    details, detailCreation,
    loadDetails, loadUsers, loadSubjects, loadAccounts, createDetail,
    showDialog, hideDialog, changeProperty,
    pageChange, clear, delDetail,
    setEdittingDetail, showEditDialog
}) {

    const [initLoaidng, setInitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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
            render: function (data) {
                return (
                    <span>
                        <span>{data.amount / 100}元</span>
                    </span>
                )
            }
        },
        {
            label: '创建时间',
            render: function (data) {
                return (
                    <span>
                        <span>{Dayjs(data.createdAt).format("YYYY-MM-DD")}</span>
                    </span>
                )
            }
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
            render: function (data) {
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
                            onClick={() => {
                                setDeleteLoading(true)
                                delDetail(data.id).then(
                                    () => {
                                        setDeleteLoading(false)
                                        loadDetails()
                                    }
                                )
                            }}
                        >删除</Button>
                    </div>
                )
            }
        }
    ];

    useEffect(() => {
        async function fetchdata() {
            setInitLoading(true);
            try {
                await Promise.all([
                    loadDetails(),
                    loadUsers(),
                    loadSubjects(),
                    loadAccounts()
                ]);
            } catch (error) {
                setInitLoading(false);
            }
            setInitLoading(false);
        }
        fetchdata();
    }, []);

    return (
        <div>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={details.content}
                border={true}
                rowKey={R.prop('id')}
            />
            <Pagination
                onCurrentChange={page => {
                    pageChange(page - 1)
                    loadDetails();
                }}
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
                                    });
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
                                    });
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
                                    });
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
                                value={detailCreation.subjectId}
                                onChange={val => {
                                    changeProperty({
                                        key: 'subjectId',
                                        val: val
                                    });
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
                                    });
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
                                    });
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
                                    });
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                onClick={() => {
                                    const pack = R.pick(['userId', 'sourceAccountId', 'destAccountId', 'subjectId', 'remark', 'amount', 'createdAt'])(detailCreation);
                                    pack.amount = pack.amount * 100
                                    createDetail(pack).then(() => {
                                        clear()
                                        loadDetails()
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

};

const mapState = R.pick(["accounts", "users", "details", 'subjects', 'detailCreation']);

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
    pageChange: dispatch.details.pageChange,
    clear: dispatch.detailCreation.clear,
    setEdittingDetail: dispatch.detailEdit.set
});

export default connect(mapState, mapDispatch)(Details);