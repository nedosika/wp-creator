import React from 'react';
import {Switch} from "antd";
import {Form} from 'antd';
import {TASK_OPTIONS, useTask} from "../../../dialogs/TaskDialog";

const Categories = () => {
    const [{
        [TASK_OPTIONS.isAddCategories]: isAdd
    },  updateTask] = useTask();

    const handleChange = (key) => (value) => updateTask({[key]: value})

    return (
        <Form.Item label="Add categories" valuePropName="checked">
            <Switch checked={isAdd} onChange={handleChange(TASK_OPTIONS.isAddCategories)}/>
        </Form.Item>
    );
};

export default Categories;