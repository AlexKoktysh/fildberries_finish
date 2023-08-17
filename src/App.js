import { useState, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import { HomePage } from "./components/HomePage";
import { getDate, editDate } from "./api";

const columns = [
  {
      "accessorKey": "id",
      "header": "№",
      "enableSorting": false,
      "enableColumnFilter": false,
      "enableColumnActions": false,
      "enableGlobalFilter": false,
      "size": 60,
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      }
  },
  {
      "accessorKey": "object",
      "header": "Наименование товара",
      "enableGlobalFilter": true,
      "size": 60,
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      }
  },
  {
      "accessorKey": "seller_article",
      "header": "Артикул поставщика",
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      },
      "size": 60
  },
  {
      "accessorKey": "wb_article",
      "enableGlobalFilter": false,
      "header": "Артикул WB",
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      },
      "size": 60
  },
  {
      "accessorKey": "currency_price",
      "enableGlobalFilter": false,
      "header": "Акционная цена, RUB",
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      },
      "size": 60
  },
  {
      "accessorKey": "price",
      "enableGlobalFilter": false,
      "header": "Акционная цена, BYN",
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      },
      "size": 60
  },
  {
      "accessorKey": "my_warehouse_commission",
      "enableGlobalFilter": false,
      "enableColumnFilter": false,
      "header": "Комиссия WB, BYN",
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      },
      "size": 60
  },
  {
      "accessorKey": "logistic_commission",
      "enableGlobalFilter": false,
      "enableColumnFilter": false,
      "filterFn": "customLogisticCommissionFilterFn",
      "header": "Комиссия логистики, BYN",
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      },
      "size": 60
  },
  {
      "accessorKey": "distributor_price",
      "enableGlobalFilter": false,
      "enableColumnFilter": false,
      "filterFn": "customDistributorFilterFn",
      "header": "Цена поставщика, BYN",
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      },
      "size": 60
  },
  {
      "accessorKey": "sum_result",
      "enableGlobalFilter": false,
      "enableColumnFilter": false,
      "header": "Выгода, BYN",
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      },
      "size": 60
  },
  {
      "accessorKey": "analyze_description",
      "enableGlobalFilter": false,
      "enableColumnFilter": false,
      "header": "Результат анализа",
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      },
      "size": 60
  },
  {
      "accessorKey": "distributor_name",
      "enableGlobalFilter": false,
      "enableColumnFilter": false,
      "header": "Наименование поставщика",
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      },
      "size": 60
  },
  {
      "accessorKey": "edit",
      "header": "Редактировать",
      "enableSorting": false,
      "enableColumnFilter": false,
      "enableColumnActions": false,
      "size": 120,
      "muiTableHeadCellProps": {
          "align": "center"
      },
      "muiTableBodyCellProps": {
          "align": "center"
      }
  }
]

export const App = () => {
  const [loading, setLoading] = useState(false);
  // const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(totalRecords / 10) || 0,
  });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [greenRows, setGreenRows] = useState([]);
  const [redRows, setRedRows] = useState([]);
  const [whiteRows, setWhiteRows] = useState([]);
  const [items, setItems] = useState([]);

  const [allert, setAllert] = useState("");

  const fetchDate = async (params) => {
    // sessionStorage.removeItem("editFields");
    setLoading(true);
    setGreenRows([]);
    setRedRows([]);
    setWhiteRows([]);
    setRows([]);
    setItems([]);
    const data = await getDate(params);
    setLoading(false);
    if (data.error) return setAllert(data.error["ajax-errors"]);
    const { columns, rows, totalRecords } = data;
    const green = rows.map((el) => {
      if (el.analyze_result === 1)
        return el.id;
    });
    const red = rows.map((el) => {
      if (el.analyze_result === 0)
        return el.id;
    });
    const white = rows.map((el) => {
      if (el.analyze_result === -1)
        return el.id;
    })
    // const custom_rows = rows.map((el) => ({
    //   ...el,
    //   "edit_remainder": (
    //     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    //       <InputComponent defaulValue={el.qty} id={el.edit_remainder} onChangeField={onChangeField} />
    //       <ButtonComponent disabled={true} />
    //     </Box>
    //   ),
    // }));
    // setRows(custom_rows);
    setRows(rows);
    setGreenRows(green);
    setRedRows(red);
    setWhiteRows(white);
    // setColumns(columns);
    setTotalRecords(totalRecords);
  };

  useEffect(() => {
    fetchDate({
      filters: columnFilters,
      sorting,
      take: pagination.pageSize,
      skip: pagination.pageSize * (pagination.page - 1),
      searchText: globalFilter,
    });
  }, [
    pagination.pageSize,
    pagination.page,
    sorting,
    columnFilters,
    globalFilter,
  ]);

  useEffect(() => {
    if (!loading) {
      const tr = document.getElementsByTagName("tr");
      setItems(tr);
    }
}, [rows, loading]);

  if (allert) {
    return <Alert severity="error">{allert}</Alert>;
  }

  return (
    <HomePage
      loading={loading}
      columns={columns}
      rows={rows}
      totalRecords={totalRecords}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      greenRows={greenRows}
      redRows={redRows}
      whiteRows={whiteRows}
      items={items}
    />
  );
};
