import React from 'react';
import {Input, Space} from "antd";
import {EyeInvisibleOutlined, EyeTwoTone, UserOutlined} from "@ant-design/icons";

const WordpressSettings = () => {
    return (
        <Space direction='vertical'>
            <Input addonBefore="url"/>
            <Input placeholder="wp login" prefix={<UserOutlined/>}/>
            <Input.Password
                addonBefore="password"
                placeholder="input password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
        </Space>
    );
};

export default WordpressSettings;