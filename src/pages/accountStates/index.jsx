import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input, Select, DatePicker } from 'element-react';
import * as R from 'ramda';
import styles from './accountStates.module.css';
import Dayjs from 'dayjs';

function AccountStates({
    accounts,
    accountStates, accountStateCreation,
    loadAccountStates, createAccountState,
    showDialog, hideDialog, changeProperty
}) {

    const columns = [
        {
            label: '账户名称',
            prop: 'accountName'
        },
        {
            label: '结算余额',
            render: function (data) {
                return (
                    <span>
                        <span>{data.amount / 100}元</span>
                    </span>
                )
            }
        },
        {
            label: '结算日期',
            render: function (data) {
                return (
                    <span>
                        <span>{Dayjs(data.createdAt).format("YYYY-MM-DD")}</span>
                    </span>
                )
            }
        }
    ];

    useEffect(() => {
        loadAccountStates();
    }, []);

    return (
        <div>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={accountStates}
                border={true}
                rowKey={R.prop('id')}
            />
            <Button
                className={styles.add}
                type="primary"
                onClick={showDialog}>
                添加结算记录
            </Button>
            <Dialog
                title="添加结算记录"
                size="tiny"
                visible={accountStateCreation.dialogVisibility}
                onCancel={hideDialog}
                rowKey={R.prop('id')}
                lockScroll={false}>
                <Dialog.Body>
                    <Form>
                        <Form.Item>
                            <Select
                                onChange={val => {
                                    changeProperty({
                                        key: 'accountId',
                                        val: val
                                    });
                                }}
                                placeholder="请选择">
                                {
                                    (accounts || []).map(account => {
                                        return <Select.Option key={account.id} label={account.name} value={account.id} />
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
                            <DatePicker
                                placeholder="请选择结算日期"
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
                                    const pack = R.pick(['createdAt', 'accountId', 'amount'])(accountStateCreation);
                                    createAccountState(pack).then(hideDialog)
                                }}
                            >确定</Button>
                        </Form.Item>
                    </Form>
                </Dialog.Body>
            </Dialog>
        </div>
    )

};

const mapState = R.pick(["accounts", "accountStates", "accountStateCreation"]);

const mapDispatch = dispatch => ({
    loadAccountStates: dispatch.accountStates.load,
    createAccountState: dispatch.accountStates.create,
    showDialog: dispatch.accountStateCreation.showDialog,
    hideDialog: dispatch.accountStateCreation.hideDialog,
    changeProperty: dispatch.accountStateCreation.changeProperty
});

export default connect(mapState, mapDispatch)(AccountStates);