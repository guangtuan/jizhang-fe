import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dialog, Button, Form, Input } from 'element-react';
import * as R from 'ramda';

function CreateDialog({ currentRecord, dialogVisibility, creation, hide }) {

    let [editing, setEditing] = useState({});

    const put = ({ key, val }) => {
        setEditing(R.assoc(key, val)(editing));
    };

    return (
        <Dialog
            title={`新增${currentRecord}`}
            size="tiny"
            visible={dialogVisibility}
            onCancel={hide}
            lockScroll={false}
        >
            <Dialog.Body>
                <Form labelWidth={80}>
                    {
                        (creation.items || []).map(
                            (item, index) =>
                                (
                                    <Form.Item key={index} label={item.label}>
                                        <Input
                                            onChange={e => put({ key: item.label, val: e })}
                                            placeholder={item.placeHolder}
                                        ></Input>
                                    </Form.Item>
                                )
                        )
                    }
                </Form>
            </Dialog.Body>
            <Dialog.Footer className="dialog-footer">
                <Button onClick={hide}>取消</Button>
                <Button type="primary" onClick={() => creation.submit(editing) && hide}>确定</Button>
            </Dialog.Footer>
        </Dialog >
    )
}

const mapState = R.pick(["dialogVisibility", "creation", "currentRecord"]);

const mapDispatch = dispatch => ({
    hide: dispatch.dialogVisibility.hide
});

export default connect(mapState, mapDispatch)(CreateDialog);