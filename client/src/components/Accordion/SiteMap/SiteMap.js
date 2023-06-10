import React from 'react';
import {Button, Checkbox, Upload, message, Space} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import fileParser from "services/fileParser";
import {SETTINGS, useSettings} from "contexts/Settings";

const SiteMap = () => {
    const [{[SETTINGS.onlyHtml]: onlyHtml}, updateSettings] = useSettings();
    const handleChange = (event) => updateSettings({
            [SETTINGS.onlyHtml]: event.target.checked
        })

    const handleRequest = ({file, onSuccess}) =>
        fileParser(file)
            .then((urls) => {
                const filteredUrls = urls.filter((url) => onlyHtml ? url.includes('.html') : true
                ).filter((url) => !url.includes('?'));

                updateSettings({[SETTINGS.urls]: filteredUrls });

                message.info(`Loaded ${filteredUrls.length} url(s)`);

                onSuccess();
            })
            .catch((error) => message.error(error));

    return (
        <Space direction='vertical'>
            <Checkbox onChange={handleChange} checked={onlyHtml}>Only .html</Checkbox>
            <Upload name="file" customRequest={handleRequest} maxCount={1}>
                <Button icon={<UploadOutlined />}>File</Button>
            </Upload>
        </Space>
    );
};

export default SiteMap;