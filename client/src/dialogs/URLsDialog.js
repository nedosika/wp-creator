import React, {useState} from 'react';
import {Button, message, Modal, Space, Table, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import fileParser from "../services/fileParser";
import {DIALOGS, useDialog} from "contexts/Dialog";

const columns = [
    {
        title: 'URL',
        dataIndex: 'url',
        //filters: [],
        //onFilter: (value, record) => record.name.indexOf(value) === 0,
        //sorter: (a, b) => a.url > b.url,
    }
];

const UrLsDialog = () => {
    const {openDialog, closeDialog} = useDialog();
    const [urls, setUrls] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleRequest = ({file, onSuccess}) =>
        fileParser(file)
            .then((urls) => {
                const filteredUrls = urls
                    //.filter((url) => onlyHtml ? url.includes('.html') : true)
                    //.filter((url) => !url.includes('?'));

                setUrls(filteredUrls.map((url) => ({key: url, url})));
                setSelectedRowKeys(filteredUrls)

                message.info(`Loaded ${filteredUrls.length} url(s)`);

                onSuccess();
            })
            .catch((error) => message.error(error));

    const handleOpenTaskDialog = () => openDialog({dialog: DIALOGS.task, props: {urls: urls.map(({url}) => url)}})

    return (
        <Modal
            title="URLs import dialog"
            centered
            open
            width="100%"
            onOk={handleOpenTaskDialog}
            onCancel={closeDialog}
        >
            <Space style={{ marginBottom: 16 }}>
                <Upload name="file" customRequest={handleRequest} maxCount={1}>
                    <Button icon={<UploadOutlined />}>File</Button>
                </Upload>
            </Space>
            <Table columns={columns} dataSource={urls} rowSelection={rowSelection}/>
        </Modal>
    );
};

export default UrLsDialog;