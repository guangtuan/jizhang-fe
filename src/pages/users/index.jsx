import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input } from 'element-react';
import * as R from 'ramda';
import styles from './users.module.css';

function Users({
    users, userCreation,
    loadUser, createUser,
    showDialog, hideDialog, changeProperty
}) {

    const columns = [
        {
            label: '账号',
            prop: 'account'
        },
        {
            label: '用户名',
            prop: 'username'
        }
    ];

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <div>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={users}
                border={true}
                rowKey={R.prop('id')}
            />
            <Button
                className={styles.add}
                type="primary"
                onClick={showDialog}>
                添加用户
            </Button>
            <Dialog
                title="添加用户"
                size="tiny"
                visible={userCreation.dialogVisibility}
                onCancel={hideDialog}
                lockScroll={false}>
                <Dialog.Body>
                    <Form>
                        <Form.Item>
                            <Input
                                placeholder="请输入账号"
                                onChange={val => {
                                    changeProperty({
                                        key: 'account',
                                        val: val
                                    });
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Input
                                placeholder="请输入用户名"
                                onChange={val => {
                                    changeProperty({
                                        key: 'username',
                                        val: val
                                    });
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                onClick={() => {
                                    const pack = R.pick(['account', 'username'])(userCreation);
                                    createUser(pack).then(hideDialog)
                                }}
                            >确定</Button>
                        </Form.Item>
                    </Form>
                </Dialog.Body>
            </Dialog>
        </div>
    )

};

const mapState = R.pick(["users", "userCreation"]);

const mapDispatch = dispatch => ({
    loadUser: dispatch.users.load,
    createUser: dispatch.users.create,
    showDialog: dispatch.userCreation.showDialog,
    hideDialog: dispatch.userCreation.hideDialog,
    changeProperty: dispatch.userCreation.changeProperty
});

export default connect(mapState, mapDispatch)(Users);