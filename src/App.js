import { useState, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import { HomePage } from "./components/HomePage";
import { getDate, editDate } from "./api";
import { InputComponent } from "./components/InputComponent";
import UserDialogComponent from "./components/UserDialogComponent";

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
];

const rows_base = [
    {
        "id": 1,
        "object": "Охлаждение процессора",
        "seller_article": "SE-207-XT ADVANCED_138938162",
        "wb_article": "SE-207-XT ADVANCED_138938162",
        "currency_price": 56.65,
        "price": 157.11,
        "my_warehouse_commission": 123,
        "logistic_commission": 99,
        "distributor_price": 166.65,
        "sum_result": 26,
        "analyze_result": 1,
        "distributor_name": "distributor_name",
        "edit": "1234567"
    },
    {
        "id": 2,
        "object": "Охлаждение процессора",
        "seller_article": "SE-207-XT ADVANCED_138938162",
        "wb_article": "SE-207-XT ADVANCED_138938162",
        "currency_price": 56.65,
        "price": 157.11,
        "my_warehouse_commission": 123,
        "logistic_commission": 99,
        "distributor_price": 166.65,
        "sum_result": 26,
        "analyze_result": 1,
        "distributor_name": "distributor_name",
        "edit": "123"
    },
];

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
    // const data = await getDate(params);
    setLoading(false);
    // if (data.error) return setAllert(data.error["ajax-errors"]);
    // const { columns, rows, totalRecords } = data;
    const green = rows_base.map((el) => {
      if (el.analyze_result === 1)
        return el.id;
    });
    const red = rows_base.map((el) => {
      if (el.analyze_result === 0)
        return el.id;
    });
    const white = rows_base.map((el) => {
      if (el.analyze_result === -1)
        return el.id;
    });
    const storageArray = rows_base.map((el) => ({
        id: el.edit,
        logistic_commission: el.logistic_commission,
        distributor_price: el.distributor_price,
    }));
    sessionStorage.setItem("editFields", JSON.stringify([...storageArray]));
    const custom_rows = rows_base.map((el) => ({
        ...el,
        "logistic_commission": <InputComponent defaultValue={el.logistic_commission} id={el.edit} onChangeField={onChangeField} fields="logistic_commission" />,
        "distributor_price": <InputComponent defaultValue={el.distributor_price} id={el.edit} onChangeField={onChangeField} fields="distributor_price" />,
        "edit": (
            <UserDialogComponent
                disabled={true}
                openDialogText="Сохранить"
                agreeActionFunc={() => saveField(el.edit)}
                agreeActionText='Сохранить одну'
                openedDialogTitle='Сохранение товарной позиции'
                desAgreeActionText="Нет, сохранить все"
                desAgreeActionFunc={saveField}
                message="По кнопке «Сохранить все», будут сохранены все отредактированные записи, по кнопке «Сохранить» только 1 запись. Вы действительно хотите сохранить только одну запись? Все остальные изминения будут утеряны."
            />
        )
    }));
    setRows(custom_rows);
    setGreenRows(green);
    setRedRows(red);
    setWhiteRows(white);
    // setColumns(columns);
    // setTotalRecords(totalRecords);
  };

  const onChangeField = (id, value, fieldName) => {
    const storageItems = JSON.parse(sessionStorage.getItem("editFields"));
    const newArray = storageItems.map((el) => {
        if (el.id === id) {
            return fieldName === "logistic_commission"
            ?
                {
                    ...el,
                    logistic_commission: Number(value),
                }
            :
                {
                    ...el,
                    distributor_price: Number(value),
                };
        }
        return el;
    });
    setRows((prev) => {
        const newRows = prev.map((el) => {
            if (el.distributor_price.props.id === id) {
                return {
                    ...el,
                    "edit": (
                        <UserDialogComponent
                            disabled={false}
                            openDialogText="Сохранить"
                            agreeActionFunc={() => saveField(el.distributor_price.props.id)}
                            agreeActionText='Сохранить одну'
                            openedDialogTitle='Сохранение товарной позиции'
                            desAgreeActionText="Нет, сохранить все"
                            desAgreeActionFunc={saveField}
                            message="По кнопке «Сохранить все», будут сохранены все отредактированные записи, по кнопке «Сохранить» только 1 запись. Вы действительно хотите сохранить только одну запись? Все остальные изминения будут утеряны."
                        />
                    )
                };
            }
            return el;
        });
        return newRows;
    });
    sessionStorage.setItem("editFields", JSON.stringify([...newArray]));
  };

  const saveField = (id) => {
    setLoading(true);
    const items = JSON.parse(sessionStorage.getItem("editFields"));
    const find = items.find((el) => el.id === id);
    let params = {};
    if (id) {
      params = {
        fields: [find],
        filters: columnFilters,
        sorting,
        take: pagination.pageSize,
        skip: pagination.pageSize * (pagination.page - 1),
        searchText: globalFilter,
      };
    } else {
      params = {
        fields: items,
        filters: columnFilters,
        sorting,
        take: pagination.pageSize,
        skip: pagination.pageSize * (pagination.page - 1),
        searchText: globalFilter,
      };
    }
    console.log("params", params);
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
