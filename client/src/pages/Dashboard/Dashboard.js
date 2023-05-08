import React, {createContext, useContext, useMemo, useState} from 'react';
import DataGrid, {SelectColumn, useFocusRef} from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import {Progress} from "antd";
import {createGlobalStyle, css, styled} from "styled-components";

import classes from "./Dashboard.module.css"

const FilterContext = createContext(undefined);

const GlobalStyle = createGlobalStyle`
  .filterCell {
    line-height: 35px;
    padding: 0;

    > div {
      padding-block: 0;
      padding-inline: 8px;

      &:first-child {
        border-block-end: 1px solid var(--rdg-border-color);
      }
    }
  }
`;

const filterContainerClassName = css`.filterCell {
    line-height: 35px;
    padding: 0;

    > div {
      padding-block: 0;
      padding-inline: 8px;

      &:first-child {
        border-block-end: 1px solid var(--rdg-border-color);
      }
    }
  }`;

const filterClassName = css`
  inline-size: 100%;
  padding: 4px;
  font-size: 14px;
`;

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

function inputStopPropagation(event) {
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.stopPropagation();
    }
}
function FilterRenderer({
    isCellSelected,
    column,
    children
}) {
    const filters = useContext(FilterContext);
    const { ref, tabIndex } = useFocusRef(isCellSelected);

    return (
        <>
            <div>{column.name}</div>
            {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>}
        </>
    );
}

const Dashboard = () => {
    const [selectedRows, setSelectedRows] = useState(() => new Set());
    const [filters, setFilters] = useState({
        name: '',
        enabled: false
    });

    const columns = useMemo(() => [
        SelectColumn,
        {
            name: 'Date',
            key: 'date',
        },
        {
            name: 'Name',
            key: 'name',
            headerCellClass: filters.enabled ? 'filterCell' : undefined,
            headerRenderer: (p) => {
                return <FilterRenderer {...p}>
                    {({filters, ...rest}) => {
                        return (
                            <input
                                {...rest}
                                className={filterClassName}
                                value={filters.name}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        name: e.target.value
                                    })
                                }
                                onKeyDown={inputStopPropagation}
                                list='names'
                            />
                        );
                    }}
                </FilterRenderer>;
            }
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
    ], [filters]);

    const filteredRows = useMemo(() => {
        return rows.filter((r) => {
            return (
                (filters.name ? r.name.includes(filters.name) : true)
            );
        });
    }, [filters]);

    return (
        <>
            <GlobalStyle/>
            <FilterContext.Provider value={filters}>
                <DataGrid
                    columns={columns}
                    rows={filteredRows}
                    selectedRows={selectedRows}
                    onSelectedRowsChange={setSelectedRows}
                    defaultColumnOptions={{
                        sortable: true,
                        resizable: true,
                        filterable: true
                    }}
                    onCellClick={(args, event) => {
                        if (args.column.key === 'name') {
                            event.preventGridDefault();
                            args.selectCell(true);
                        }
                    }}
                    rowKeyGetter={(row) => row.id}
                    headerRowHeight={filters.enabled ? 70 : undefined}
                />
            </FilterContext.Provider>
        </>
    );
}

export default Dashboard;