import React from 'react';
import {Input, Space, Form, Button} from "antd";
import {TASK_OPTIONS, useTask} from "dialogs/TaskDialog";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import styles from "./Content.module.css";

const Content = () => {
    const [{
        [TASK_OPTIONS.headerSelector]: headerSelector,
        [TASK_OPTIONS.contentSelector]: contentSelector,
        [TASK_OPTIONS.contentReplacers]: contentReplacers
    }, updateTask] = useTask();

    const handleChange = (key) => ({target:{value}}) => updateTask({[key]: value});

    const handleChangeReplacers = (index) => ({target:{value}}) => {
        updateTask({[TASK_OPTIONS.contentReplacers]: [...contentReplacers.slice(0, index), value ,...contentReplacers.slice(index + 1)]})
    }

    const handleAddReplacer = () => {
        updateTask({[TASK_OPTIONS.contentReplacers]: [...contentReplacers, '']})
    }

    const handleRemoveReplacer = (index) => () => {
        updateTask({[TASK_OPTIONS.contentReplacers]: [...contentReplacers.slice(0, index), ...contentReplacers.slice(index + 1)]})
    }

    return (
        <Space direction='vertical'>
            <Input addonBefore="Header selector" value={headerSelector} onChange={handleChange(TASK_OPTIONS.headerSelector)}/>
            <Input addonBefore="Content Selector" value={contentSelector} onChange={handleChange(TASK_OPTIONS.contentSelector)}/>
            {contentReplacers.map((value, index) => (
                <div>
                    <Input addonBefore="Replacer" value={value} onChange={handleChangeReplacers(index)} style={{width: '87%'}}/>
                    <MinusCircleOutlined
                        className={styles.dynamicDeleteButton}
                        onClick={handleRemoveReplacer(index)}
                    />
                </div>
            ))}
            <Button
                type="dashed"
                style={{
                    width: '100%',
                }}
                icon={<PlusOutlined />}
                onClick={handleAddReplacer}
            >
                Add replacer
            </Button>
        </Space>
    );
};

export default Content;