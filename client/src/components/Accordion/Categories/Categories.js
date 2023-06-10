import React from 'react';
import {Switch} from "antd";
import {Form} from 'antd';

const Categories = () => {
    return (
        <Form.Item label="Add categories" valuePropName="checked">
            <Switch />
        </Form.Item>
    );
};

export default Categories;