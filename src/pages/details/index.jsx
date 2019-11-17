import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input, Select, DatePicker, Pagination } from 'element-react';
import * as R from 'ramda';
import styles from './details.module.css';
import Dayjs from 'dayjs';

function Details({
    accounts, users, subjects,
    details, detailCreation,
    loadDetails, createDetail,
    showDialog, hideDialog, changeProperty,
    pageChange, clear, delDetail
}) {

    const transformToQuery = R.applySpec({
        page: R.pipe(R.prop('pageable'), R.prop('pageNumber')),
        size: R.pipe(R.prop('pageable'), R.prop('pageSize'))
    });

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
                if (data.updatedAt == null || data.updatedAt == undefined) {
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
                return <Button
                    type='danger'
                    onClick={() => {
                        delDetail(data.id).then(
                            loadDetails(transformToQuery(details))
                        )
                    }}
                >删除</Button>
            }
        }
    ];

    useEffect(() => {
        loadDetails(transformToQuery(details));
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
                    console.log(JSON.stringify(transformToQuery(details)))
                    loadDetails(transformToQuery(details));
                }}
                className={styles.page}
                layout="prev, pager, next"
                total={details.totalElements} />
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
                        <Form.Item>
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
                        <Form.Item>
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
                        <Form.Item>
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
                        <Form.Item>
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
                                    (subjects || []).map(subject => {
                                        return <Select.Option key={subject.id} label={subject.name} value={subject.id} />
                                    })
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
                                        loadDetails(transformToQuery(details))
                                    })
                                }}
                            >确定</Button>
                        </Form.Item>
                    </Form>
                </Dialog.Body>
            </Dialog>
        </div>
    )

};

const mapState = R.pick(["accounts", "users", "details", 'subjects', 'detailCreation']);

const mapDispatch = dispatch => ({
    loadDetails: dispatch.details.load,
    createDetail: dispatch.details.create,
    delDetail: dispatch.details.del,
    showDialog: dispatch.detailCreation.showDialog,
    hideDialog: dispatch.detailCreation.hideDialog,
    changeProperty: dispatch.detailCreation.changeProperty,
    pageChange: dispatch.details.pageChange,
    clear: dispatch.detailCreation.clear
});

export default connect(mapState, mapDispatch)(Details);