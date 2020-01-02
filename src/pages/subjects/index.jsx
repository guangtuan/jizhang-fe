import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Layout, Button, Dialog, Form, Input, Card } from 'element-react';
import * as R from 'ramda';
import styles from './subjects.module.css';

function Subjects({
    subjects, subjectCreation,
    loadSubjects, createSubject,
    showDialog, hideDialog, changeProperty,
    clear
}) {

    const transformToQuery = R.applySpec({
        page: R.pipe(R.prop('pageable'), R.prop('pageNumber')),
        size: R.pipe(R.prop('pageable'), R.prop('pageSize'))
    });

    useEffect(() => {
        loadSubjects(transformToQuery(subjects));
    }, []);

    return (
        <div className={styles.tags}>
            {subjects.map(sub => (
                <Layout.Col span={4} offset={0} >
                    <Card type="gray" className={styles.subjectTag} key={sub.id}>
                        <div>{sub.name}</div>
                        <div className={styles.description}>{sub.description}</div>
                    </Card>
                </Layout.Col>
            ))}
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
    clear: dispatch.subjectCreation.clear
});

export default connect(mapState, mapDispatch)(Subjects);