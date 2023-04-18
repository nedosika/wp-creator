import React from 'react';
import {Button, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

import classes from "./LoginPage.module.css"

const LoginPage = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className={classes.LoginHeader}>
            <Form
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item>
                    <Input
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                        placeholder="Username"
                    />
                </Form.Item>

                <Form.Item>
                    <Input
                        type="password"
                        placeholder="Password"
                        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className={classes.SubmitButton}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginPage;