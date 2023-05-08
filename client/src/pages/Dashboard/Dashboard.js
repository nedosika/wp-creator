import React, { useState} from 'react';
import { Resizable } from 'react-resizable';
import {Progress, Table} from "antd";

import "./Dashboard.css";


const initialColumns = [
    {
        title: 'Date',
        dataIndex: 'date',
        width: 100
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: 100
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
        render: (props) => {
            console.log(props)
            return <Progress percent={props} size="small"/>;
        },
    },
    {
        title: 'End Date',
        dataIndex: 'end_date',
        width: 100
    },
    {
        title: 'Action',
        dataIndex: 'action',
        render: () => <a>Delete</a>,
        width: 100
    },
];

const rows = [
    {
        key: 0,
        name: 'nedosika.pp.ua',
        date: '01.02.2023',
        status: 'start',
        progress: 10,
        end_date: '01.02.2023',
    },
    {
        key: 1,
        name: 'Jim Green',
        date: '01.02.2023',
        status: 'start',
        progress: 20,
        end_date:'01.02.2023',
    },
    {
        key: 2,
        name: 'Joe Black',
        date: '01.02.2023',
        status: 'start',
        progress: 30,
        end_date: '01.02.2023',
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
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [columns, setColumns] = useState(initialColumns);
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const handleResize =
        (index) =>
            (_, { size }) => {
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

    return (
        <Table
            bordered
            components={{
                header: {
                    cell: ResizableTitle,
                },
            }}
            columns={mergeColumns}
            dataSource={rows}
            rowSelection={rowSelection}
        />
    );
}

export default Dashboard;