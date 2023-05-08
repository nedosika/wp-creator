import React, { useCallback, useMemo, useState} from 'react';
import DataGrid, {SelectColumn} from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import {Progress} from "antd";

const columns = [
    SelectColumn,
    {
        name: 'Date',
        key: 'date',
    },
    {
        name: 'Name',
        key: 'name',
    },
    {
        name: 'Status',
        key: 'status',
    },
    {
        name: "Progress",
        key: 'progress',
        formatter: ({row: {progress}}) => <Progress percent={progress} size="small"/>
    },
    {
        name: 'End Date',
        key: 'end_date',
    },
];

const rows = [
    {
        id: '1',
        name: 'nedosika.pp.ua',
        date: '01.02.2023',
        status: 'start',
        progress: 10,
        end_date: '01.02.2023',
    },
    {
        id: '2',
        name: 'Jim Green',
        date: '01.02.2023',
        status: 'start',
        progress: 20,
        end_date:'01.02.2023',
    },
    {
        id: '3',
        name: 'Joe Black',
        date: '01.02.2023',
        status: 'start',
        progress: 30,
        end_date: '01.02.2023',
    },
];

const Dashboard = () => {
    const [selectedRows, setSelectedRows] = useState(() => new Set());
    const [sortColumns, setSortColumns] = useState([]);

    const onSortColumnsChange = useCallback((sortColumns) => {
        setSortColumns(sortColumns.slice(-1));
    }, []);

    const sortedRows = useMemo(() => {
        if (sortColumns.length === 0) return rows;
        const { columnKey, direction } = sortColumns[0];

        let sortedRows = [...rows];

        switch (columnKey) {
            case 'name':
                sortedRows = sortedRows.sort((a, b) => a[columnKey].localeCompare(b[columnKey]));
                break;
            default:
        }
        return direction === 'DESC' ? sortedRows.reverse() : sortedRows;
    }, [sortColumns]);

    return (
                <DataGrid
                    columns={columns}
                    rows={sortedRows}
                    selectedRows={selectedRows}
                    onSelectedRowsChange={setSelectedRows}
                    sortColumns={sortColumns}
                    onSortColumnsChange={onSortColumnsChange}
                    defaultColumnOptions={{
                        sortable: true,
                        resizable: true
                    }}
                    onCellClick={(args, event) => {
                        if (args.column.key === 'name') {
                            event.preventGridDefault();
                            args.selectCell(true);
                        }
                    }}
                    rowKeyGetter={(row) => row.id}
                />
    );
}

export default Dashboard;