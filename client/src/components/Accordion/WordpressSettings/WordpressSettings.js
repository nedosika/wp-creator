import React from 'react';
import {Input, Space} from "antd";
import {EyeInvisibleOutlined, EyeTwoTone, UserOutlined} from "@ant-design/icons";
import {TASK_OPTIONS, useTask} from "dialogs/TaskDialog";

const WordpressSettings = () => {
    const [{
        [TASK_OPTIONS.endpoint]: endpoint,
        [TASK_OPTIONS.endpointSuffix]: suffix,
        [TASK_OPTIONS.username]: username,
        [TASK_OPTIONS.password]: password
    },  updateTask] = useTask();

    const handleChange = (key) => ({target:{value}}) => updateTask({[key]: value})

    return (
        <Space direction='vertical'>
            <Space.Compact>
                <Input addonBefore="endpoint" value={endpoint} onChange={handleChange(TASK_OPTIONS.endpoint)}/>
                <Input value={suffix} onChange={handleChange(TASK_OPTIONS.endpointSuffix)} style={{width: '100px'}}/>
            </Space.Compact>
            <Input placeholder="wp login" prefix={<UserOutlined/>} value={username} onChange={handleChange(TASK_OPTIONS.username)}/>
            <Input.Password
                addonBefore="password"
                placeholder="input password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                value={password}
                onChange={handleChange(TASK_OPTIONS.password)}
            />
        </Space>
    );
};

export default WordpressSettings;