import React from 'react';
import {Checkbox, Input, InputNumber, Select, Space} from "antd";
import {TASK_OPTIONS, useTask} from "dialogs/TaskDialog";

const Content = () => {
    const [{[TASK_OPTIONS.titleSelector]: titleSelector, [TASK_OPTIONS.contentSelector]: contentSelector}, updateTask] = useTask();

    const handleChange = (key) => ({target:{value}}) => updateTask({[key]: value})

    return (
        <Space direction='vertical'>
            <Input addonBefore="TitleSelector" value={titleSelector} onChange={handleChange(TASK_OPTIONS.titleSelector)}/>
            <Input addonBefore="ContentSelector" value={contentSelector} onChange={handleChange(TASK_OPTIONS.contentSelector)}/>
            {/*<Checkbox>Strong search</Checkbox>*/}
            {/*<Space>*/}
            {/*    Sort by:*/}
            {/*    <Select*/}
            {/*        defaultValue="Content"*/}
            {/*        options={[*/}
            {/*            { value: 'title', label: 'Content' },*/}
            {/*            { value: 'date', label: 'Date' },*/}
            {/*        ]}*/}
            {/*    />*/}
            {/*</Space>*/}
            {/*<Space>*/}
            {/*    Order:*/}
            {/*    <Select*/}
            {/*        defaultValue="ASC"*/}
            {/*        options={[*/}
            {/*            { value: 'asc', label: 'ASC' },*/}
            {/*            { value: 'desc', label: 'DESC' },*/}
            {/*        ]}*/}
            {/*    />*/}
            {/*</Space>*/}
        </Space>
    );
};

export default Content;