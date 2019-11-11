import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input, Select } from 'element-react';
import * as R from 'ramda';
import styles from './account.module.css';

function Accounts({
    users,
    accounts, accountCreation,
    loadAccount, createAccount,
    showDialog, hideDialog, changeProperty
}) {

    const columns = [
        {
            label: 'type',
            prop: 'type'
        },
        {
            label: 'user',
            prop: 'user'
        },
        {
            label: 'name',
            prop: 'name'
        },
        {
            label: 'description',
            prop: 'description'
        }
    ];

    useEffect(() => {
        loadAccount();
    }, []);

    return (
        <div>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={accounts}
                border={true}
                rowKey={R.prop('id')}
            />
            <Button
                className={styles.add}
                type="primary"
                onClick={showDialog}>
                添加账户
            </Button>
            <Dialog
                title="添加用户"
                size="tiny"
                visible={accountCreation.dialogVisibility}
                onCancel={hideDialog}
                lockScroll={false}>
                <Dialog.Body>
                    <Form>
                        <Form.Item>
                            <Select
                                onChange={val => {
                                    changeProperty({
                                        key: 'user',
                                        val: val
                                    });
                                }}
                                placeholder="请选择">
                                {
                                    (users || []).map(user => {
                                        return <Select.Option key={user.account} label={user.username} value={user.account} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Select
                                onChange={val => {
                                    changeProperty({
                                        key: 'type',
                                        val: val
                                    });
                                }}
                                placeholder="请选择">
                                {
                                    [
                                        {
                                            name: "资产",
                                            value: "assets"
                                        },
                                        {
                                            name: "负债",
                                            value: "liabilities"
                                        }
                                    ].map(({ name, value }) => {
                                        return <Select.Option key={value} label={name} value={value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Input
                                placeholder="请输入描述"
                                onChange={val => {
                                    changeProperty({
                                        key: 'description',
                                        val: val
                                    });
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Input
                                placeholder="请输入账户名称"
                                onChange={val => {
                                    changeProperty({
                                        key: 'name',
                                        val: val
                                    });
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                onClick={() => {
                                    const pack = R.pick(['user', 'type', 'name', 'description'])(accountCreation);
                                    createAccount(pack).then(hideDialog)
                                }}
                            >确定</Button>
                        </Form.Item>
                    </Form>
                </Dialog.Body>
            </Dialog>
        </div>
    )

};

const mapState = R.pick(["users", "accounts", "accountCreation"]);

const mapDispatch = dispatch => ({
    loadAccount: dispatch.accounts.load,
    createAccount: dispatch.accounts.create,
    showDialog: dispatch.accountCreation.showDialog,
    hideDialog: dispatch.accountCreation.hideDialog,
    changeProperty: dispatch.accountCreation.changeProperty
});

export default connect(mapState, mapDispatch)(Accounts);