import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input, Select } from 'element-react';
import * as R from 'ramda';
import styles from './accounts.module.css';

function Accounts({
    users,
    accountTypeDefine,
    accounts, accountCreation,
    loadAccounts, createAccount,
    showDialog, hideDialog, changeProperty
}) {

    const columns = [
        {
            label: '账户类型',
            render: function ({ type }) {
                return (
                    <span>
                        <span>{R.prop("name")(R.find(R.propEq('value', type))(accountTypeDefine))}</span>
                    </span>
                )
            }
        },
        {
            label: '账户名字',
            prop: 'name'
        },
        {
            label: '所属用户',
            prop: 'username'
        },
        {
            label: '描述',
            prop: 'description'
        }
    ];

    useEffect(() => {
        loadAccounts();
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
                title="添加账户"
                size="tiny"
                visible={accountCreation.dialogVisibility}
                onCancel={hideDialog}
                lockScroll={false}>
                <Dialog.Body>
                    <Form>
                        <Form.Item label="所属用户">
                            <Select
                                onChange={val => {
                                    changeProperty({
                                        key: 'userId',
                                        val: val
                                    });
                                }}
                                placeholder="请选择所属用户">
                                {
                                    (users || []).map(user => {
                                        return <Select.Option key={user.id} label={user.username} value={user.id} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="账户类型">
                            <Select
                                onChange={val => {
                                    changeProperty({
                                        key: 'type',
                                        val: val
                                    });
                                }}
                                placeholder="请选择账户类型">
                                {
                                    accountTypeDefine.map(({ name, value }) => {
                                        return <Select.Option key={value} label={name} value={value} />
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="描述">
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
                        <Form.Item label="账户名称">
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
                                    const pack = R.pick(['userId', 'type', 'name', 'description'])(accountCreation);
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

const mapState = R.pick([
    "users", "accounts", "accountCreation", "accountTypeDefine"
]);

const mapDispatch = dispatch => ({
    loadAccounts: dispatch.accounts.load,
    createAccount: dispatch.accounts.create,
    showDialog: dispatch.accountCreation.showDialog,
    hideDialog: dispatch.accountCreation.hideDialog,
    changeProperty: dispatch.accountCreation.changeProperty
});

export default connect(mapState, mapDispatch)(Accounts);