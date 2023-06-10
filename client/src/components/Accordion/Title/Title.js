import React from 'react';
import {Checkbox, Form, Input, InputNumber, Select, Space, Switch} from "antd";

const Title = () => {
    return (
        <Space direction='vertical'>
            <Input addonBefore="RegExp"/>
            <InputNumber addonBefore="Index of result" min={1} max={10} defaultValue={1}/>
            <Checkbox>Strong search</Checkbox>
            <Space>
                Sort by:
                <Select
                    defaultValue="Title"
                    options={[
                        { value: 'title', label: 'Title' },
                        { value: 'date', label: 'Date' },
                    ]}
                />
            </Space>
            <Space>
                Order:
                <Select
                    defaultValue="ASC"
                    options={[
                        { value: 'asc', label: 'ASC' },
                        { value: 'desc', label: 'DESC' },
                    ]}
                />
            </Space>
        </Space>
    );
};

export default Title;