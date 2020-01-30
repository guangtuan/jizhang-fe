import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input, Select, DatePicker, Pagination, Loading } from 'element-react';
import * as R from 'ramda';
import styles from './detailEdit.module.css';

function DetailEdit({
    detailEdit, hideDialog, changeProperty,
    users, accounts, subjects,
    updateDetail, clear, updateSingleRow
}) {
    return (<Dialog
        title="编辑明细"
        size="tiny"
        visible={detailEdit.dialogVisibility}
        onCancel={hideDialog}
        lockScroll={false}>
        <Dialog.Body>
            <Form>
                <Form.Item label="用户">
                    <Select
                        value={detailEdit.userId}
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
                        value={detailEdit.sourceAccountId}
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
                        value={detailEdit.destAccountId}
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
                        value={detailEdit.subjectId}
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
                        value={detailEdit.amount}
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
                        value={detailEdit.remark}
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
                        value={detailEdit.createdAt}
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
                            const pack = R.pick(['id', 'userId', 'sourceAccountId', 'destAccountId', 'subjectId', 'remark', 'amount', 'createdAt'])(detailEdit);
                            pack.amount = pack.amount * 100
                            updateDetail({ payload: pack, id: pack.id }).then(updated => {
                                clear()
                                hideDialog()
                                console.log(JSON.stringify(updated))
                                updateSingleRow(updated)
                            })
                        }}
                    >确定</Button>
                </Form.Item>
            </Form>
        </Dialog.Body>
    </Dialog>)
}

const mapState = R.pick(["accounts", "users", "details", 'subjects', 'detailEdit']);

const mapDispatch = dispatch => ({
    updateDetail: dispatch.detailEdit.update,
    showDialog: dispatch.detailEdit.showDialog,
    hideDialog: dispatch.detailEdit.hideDialog,
    changeProperty: dispatch.detailEdit.changeProperty,
    clear: dispatch.detailEdit.clear,
    updateSingleRow: dispatch.details.updateSingleRow
});

export default connect(mapState, mapDispatch)(DetailEdit);