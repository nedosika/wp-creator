import React from 'react';
import {Button, Checkbox, Upload, message, Space} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import fileParser from "../../../services/fileParser";

const SiteMap = () => {
    const handleChange = () => {}

    const handleRequest = ({file}) => {
        fileParser(file).then((result) => {
            console.log(result)
        }).catch((error) => message.error(error))
    }

    return (
        <Space direction='vertical'>
            <Checkbox onChange={handleChange}>Only .html</Checkbox>
            <Upload name="file" customRequest={handleRequest}>
                <Button icon={<UploadOutlined />}>File</Button>
            </Upload>
        </Space>
    );
};

export default SiteMap;