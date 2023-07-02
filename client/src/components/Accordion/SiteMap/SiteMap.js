import React from 'react';
import {Button, Checkbox, Upload, message, Space} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import fileParser from "services/fileParser";
import {TASK_OPTIONS, useTask} from "dialogs/TaskDialog";

const SiteMap = () => {
    const [{[TASK_OPTIONS.onlyHtml]: onlyHtml}, updateTask] = useTask();

    const handleChangeOlyHtml = (event) => updateTask({[TASK_OPTIONS.onlyHtml]: event.target.checked})

    const handleRequest = ({file, onSuccess}) =>
        fileParser(file)
            .then((urls) => {
                const filteredUrls = urls.filter((url) => onlyHtml ? url.includes('.html') : true
                ).filter((url) => !url.includes('?'));

                updateTask({[TASK_OPTIONS.urls]: filteredUrls });

                message.info(`Loaded ${filteredUrls.length} url(s)`);

                onSuccess();
            })
            .catch((error) => message.error(error));

    return (
        <Space direction='vertical'>
            <Checkbox onChange={handleChangeOlyHtml} checked={onlyHtml}>Only .html</Checkbox>
            <Upload name="file" customRequest={handleRequest} maxCount={1}>
                <Button icon={<UploadOutlined />}>File</Button>
            </Upload>
        </Space>
    );
};

export default SiteMap;