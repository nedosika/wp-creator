import React, { useState} from 'react';
import { Resizable } from 'react-resizable';
import {Button, FloatButton, Popconfirm, Progress, Space, Table} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import {useMutation, useQuery} from '@apollo/client';

import "./Dashboard.css";
import {DIALOGS, useDialog} from "contexts/Dialog";
import {GET_TASKS} from "apollo/queries";
import {DELETE_TASK} from "../../apollo/mutations";

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

const useColumns = () => {
    const [deleteTask] = useMutation(DELETE_TASK, {refetchQueries: [GET_TASKS]});

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 100,
            sorter: (a, b) => a.id - b.id,
            filterSearch: true,
            onFilter: (value, record) => record.name.indexOf(value) === 0,
        },
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
            render: (_, {id}) => {
                return (
                    <Space>
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => deleteTask({variables: {id}})}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    </Space>
                );
            },
            width: 100
        },
    ];

    return columns;
}
const Dashboard = () => {
    const {openDialog} = useDialog();
    const {loading, data = {}} = useQuery(GET_TASKS);
    const initialColumns = useColumns();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [columns, setColumns] = useState(initialColumns);

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

    const handleOpenDialog = () => openDialog({dialog: DIALOGS.task})

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
                // onRow={(record, rowIndex) => ({
                //     onClick: (event) => openDialog({dialog: DIALOGS.info}, record),
                // })}
            />
            <FloatButton onClick={handleOpenDialog} shape='circle' icon={<PlusOutlined />} size="large"/>
        </>
    );
}

export default Dashboard;