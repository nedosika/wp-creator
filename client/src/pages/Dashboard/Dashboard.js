import React, { useState} from 'react';
import { Resizable } from 'react-resizable';
import {Button, FloatButton, Progress, Space, Table} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';

import "./Dashboard.css";
import {DIALOGS, useDialog} from "contexts/Dialog";
import {GET_TASKS} from "apollo/queries";

const initialColumns = [
    {
        title: 'Date',
        dataIndex: 'date',
        width: 100
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: 100,
        render: (_, record) =>
            (
                <Space size="middle">
                    {record.name}
                </Space>
            ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        width: 100,
        sorter: (a, b) => a.amount - b.amount,
        filterSearch: true,
        onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
        title: "Progress",
        dataIndex: 'progress',
        width: 100,
        render: (props) => <Progress percent={props} size="small"/>,
    },
    {
        title: 'End Date',
        dataIndex: 'end_date',
        width: 100
    },
    {
        title: 'Action',
        dataIndex: 'action',
        render: () => <Space><Button>Edit</Button><Button>Delete</Button><Button>Result</Button></Space>,
        width: 100
    },
];

const ResizableTitle = (props) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{
                enableUserSelectHack: false,
            }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

const Dashboard = () => {
    const {loading, error, data = {}} = useQuery(GET_TASKS)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [columns, setColumns] = useState(initialColumns);
    const {openDialog} = useDialog();
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleResize = (index) => (_, { size }) => {
        const newColumns = [...columns];
        newColumns[index] = {
            ...newColumns[index],
            width: size.width,
        };
        setColumns(newColumns);
    };

    const mergeColumns = columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
            width: column.width,
            onResize: handleResize(index),
        }),
    }));

    const handleOpenDialog = () => openDialog({dialog: DIALOGS.Task})

    if(loading)
        return null;

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button>Clear filters</Button>
                <Button>Clear filters and sorters</Button>
                <Button onClick={handleOpenDialog}>Add</Button>
                <Button>Delete</Button>
            </Space>
            <Table
                bordered
                components={{
                    header: {cell: ResizableTitle,},
                }}
                columns={mergeColumns}
                dataSource={data.tasks}
                rowSelection={rowSelection}
                rowKey="id"
                onRow={(record, rowIndex) => ({
                    onClick: (event) => openDialog({dialog: DIALOGS.Info}),
                })}
            />
            <FloatButton onClick={handleOpenDialog} shape='circle' icon={<PlusOutlined />} size="large"/>
        </>
    );
}

export default Dashboard;