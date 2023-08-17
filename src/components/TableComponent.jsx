import MaterialReactTable from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { PaginationComponent } from "./PaginationComponent";
import { useEffect } from "react";

export const TableComponent = (props) => {
    const {
        totalRecords,
        pagination,
        setPagination,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        globalFilter,
        setGlobalFilter,
        loading,
        columns,
        rows,
        greenRows,
        redRows,
        whiteRows,
        items,
    } = props;

    useEffect(() => {
        greenRows.forEach((el) => {
            if (items[el]) {
                items[el].style.backgroundColor = "green";
            }
        });
        redRows.forEach((el) => {
            if (items[el]) {
                items[el].style.backgroundColor = "red";
            }
        });
        whiteRows.forEach((el) => {
            if (items[el]) {
                items[el].style.backgroundColor = "rgb(255, 255, 255)";
            }
        });
    }, [greenRows, redRows, items, whiteRows]);

    return (
        <MaterialReactTable
            columns={columns}
            data={rows}
            initialState={{ density: 'compact' }}
            state={{
                pagination,
                sorting,
                columnFilters,
                globalFilter,
                showSkeletons: loading,
            }}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={setGlobalFilter}
            rowCount={totalRecords}
            localization={MRT_Localization_RU}
            defaultColumn={{
                minSize: 40,
                maxSize: 300,
                size: 250,
            }}
            muiTablePaginationProps={{
                rowsPerPageOptions: [5, 10, 20],
                width: "100%",
                className: "pagination",
                ActionsComponent: () => PaginationComponent({ setPagination, pagination, totalRecords })
            }}
        />
    );
};