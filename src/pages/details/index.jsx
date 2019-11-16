import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input, Select, DatePicker } from 'element-react';
import * as R from 'ramda';
import styles from './details.module.css';
import Dayjs from 'dayjs';

function Details({
    accounts, users, subjects,
    details, detailCreation,
    loadDetails, createDetail,
    showDialog, hideDialog, changeProperty
}) {
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
            label: '目标账户',
            prop: 'destAccountName'
        },
        {
            label: '科目',
            prop: 'subjectName'
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
        }
    ];

    useEffect(() => {
        loadDetails();
    }, []);

    return (
        <div>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={details}
                border={true}
                rowKey={R.prop('id')}
            />
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
                                placeholder="请输入金额（单位：元）"
                                onChange={val => {
                                    changeProperty({
                                        key: 'amount',
                                        val: parseFloat(val) * 100
                                    });
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                onClick={() => {
                                    const pack = R.pick(['userId', 'sourceAccountId', 'destAccountId', 'subjectId', 'remark', 'amount'])(detailCreation);
                                    createDetail(pack).then(hideDialog)
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
    showDialog: dispatch.detailCreation.showDialog,
    hideDialog: dispatch.detailCreation.hideDialog,
    changeProperty: dispatch.detailCreation.changeProperty
});

export default connect(mapState, mapDispatch)(Details);