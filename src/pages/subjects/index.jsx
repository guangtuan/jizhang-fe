import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Dialog, Form, Input, Pagination } from 'element-react';
import * as R from 'ramda';
import styles from './subjects.module.css';

function Subjects({
    subjects, subjectCreation,
    loadSubjects, createSubject,
    showDialog, hideDialog, changeProperty,
    clear, pageChange
}) {

    const transformToQuery = R.applySpec({
        page: R.pipe(R.prop('pageable'), R.prop('pageNumber')),
        size: R.pipe(R.prop('pageable'), R.prop('pageSize'))
    });

    const columns = [
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
        loadSubjects(transformToQuery(subjects));
    }, []);

    return (
        <div>
            <Table
                defaultExpandAll={true}
                columns={columns}
                data={subjects.content}
                border={true}
                rowKey={R.prop('id')}
            />
            <Pagination
                onCurrentChange={page => {
                    pageChange(page - 1)
                    loadSubjects(transformToQuery(subjects));
                }}
                className={styles.page}
                layout="prev, pager, next"
                total={subjects.totalElements} />
            <Button
                className={styles.add}
                type="primary"
                onClick={showDialog}>
                添加科目
            </Button>
            <Dialog
                title="添加科目"
                size="tiny"
                visible={subjectCreation.dialogVisibility}
                onCancel={hideDialog}
                lockScroll={false}>
                <Dialog.Body>
                    <Form>
                        <Form.Item>
                            <Input
                                value={subjectCreation.name}
                                placeholder="请输入科目名称"
                                onChange={val => {
                                    changeProperty({
                                        key: 'name',
                                        val: val
                                    });
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Input
                                value={subjectCreation.description}
                                placeholder="请输入科目描述"
                                onChange={val => {
                                    changeProperty({
                                        key: 'description',
                                        val: val
                                    });
                                }}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                onClick={() => {
                                    const pack = R.pick(['name', 'description', 'tags'])(subjectCreation);
                                    createSubject(pack).then(clear)
                                }}
                            >确定</Button>
                        </Form.Item>
                    </Form>
                </Dialog.Body>
            </Dialog>
        </div>
    )

};

const mapState = R.pick(["subjects", "subjectCreation"]);

const mapDispatch = dispatch => ({
    loadSubjects: dispatch.subjects.load,
    createSubject: dispatch.subjects.create,
    showDialog: dispatch.subjectCreation.showDialog,
    hideDialog: dispatch.subjectCreation.hideDialog,
    changeProperty: dispatch.subjectCreation.changeProperty,
    clear: dispatch.subjectCreation.clear,
    pageChange: dispatch.subjects.pageChange
});

export default connect(mapState, mapDispatch)(Subjects);