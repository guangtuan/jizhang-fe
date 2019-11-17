import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input, Select, DatePicker, Pagination } from 'element-react';
import * as R from 'ramda';
import styles from './accountStates.module.css';
import Dayjs from 'dayjs';

function AccountStates({
    accounts,
    accountStates, accountStateCreation,
    loadAccountStates, createAccountState,
    showDialog, hideDialog, changeProperty,
    pageChange, clear
}) {

    const transformToQuery = R.applySpec({
        page: R.pipe(R.prop('pageable'), R.prop('pageNumber')),
        size: R.pipe(R.prop('pageable'), R.prop('pageSize'))
    });

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
        loadAccountStates(transformToQuery(accountStates));
    }, []);

    return (
        <div>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={accountStates.content}
                border={true}
                rowKey={R.prop('id')}
            />
            <div>
                <Pagination
                    onCurrentChange={page => {
                        pageChange(page - 1)
                        console.log(JSON.stringify(transformToQuery(accountStates)))
                        loadAccountStates(transformToQuery(accountStates));
                    }}
                    className={styles.page}
                    layout="prev, pager, next"
                    total={accountStates.totalElements} />
                <Button
                    className={styles.add}
                    type="primary"
                    onClick={showDialog}>
                    添加结算记录
            </Button>
            </div>
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
                                value={accountStateCreation.amount}
                                placeholder="请输入金额（单位：元）"
                                onChange={val => {
                                    changeProperty({
                                        key: 'amount',
                                        val
                                    });
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <DatePicker
                                value={accountStateCreation.createdAt}
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
                                    pack.amount = parseFloat(pack.amount) * 100
                                    createAccountState(pack).then(() => {
                                        clear()
                                        loadAccountStates(transformToQuery(accountStates))
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

const mapState = R.pick(["accounts", "accountStates", "accountStateCreation"]);

const mapDispatch = dispatch => ({
    loadAccountStates: dispatch.accountStates.load,
    createAccountState: dispatch.accountStates.create,
    showDialog: dispatch.accountStateCreation.showDialog,
    hideDialog: dispatch.accountStateCreation.hideDialog,
    changeProperty: dispatch.accountStateCreation.changeProperty,
    pageChange: dispatch.accountStates.pageChange,
    clear: dispatch.accountStateCreation.clear
});

export default connect(mapState, mapDispatch)(AccountStates);