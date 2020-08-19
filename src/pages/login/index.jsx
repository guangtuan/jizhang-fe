import React, { useEffect, useState } from 'react';
import { Button, Input, Form } from 'element-react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import styles from './login.module.css';
import { useHistory } from "react-router-dom";

function Login({ login, session }) {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    let history = useHistory();

    useEffect(() => {
        history.push("/login");
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <Form>
                    <Form.Item>
                        <Input value={email} onChange={setEmail} placeholder="输入账户"></Input>
                    </Form.Item>
                    <Form.Item>
                        <Input value={password} onChange={setPassword} type="password" placeholder="输入密码"></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={async () => {
                            await login({ password, email });
                            history.replace('/')
                        }}>登录</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

const mapState = R.pick(['session']);

const mapDispatch = dispatch => ({
    login: dispatch.session.login
});

export default connect(mapState, mapDispatch)(Login);