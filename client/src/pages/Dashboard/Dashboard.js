import React from 'react';
import {Space, Table, Tag} from "antd";

const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'End Date',
        key: 'end_date',
        dataIndex: 'end_date',
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Space size="middle">
                <a>Delete</a>
                <a>Stop</a>
                <a>Pause</a>
                <a>Resume</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'nedosika.pp.ua',
        date: '01.02.2023',
        status: 'start',
        end_date: '01.02.2023',
    },
    {
        key: '2',
        name: 'Jim Green',
        date: '01.02.2023',
        status: 'start',
        end_date:'01.02.2023',
    },
    {
        key: '3',
        name: 'Joe Black',
        date: '01.02.2023',
        status: 'start',
        end_date: '01.02.2023',
    },
];

const Dashboard = () => {
    return (
        <Table columns={columns} dataSource={data} />
    );
};

export default Dashboard;