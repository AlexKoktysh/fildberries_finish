import { useState, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import { HomePage } from "./components/HomePage";
import { getDate, editDate } from "./api";
import { InputComponent } from "./components/InputComponent";
import UserDialogComponent from "./components/UserDialogComponent";

export const App = () => {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
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

  const setRenderRows = ({ columns, rows, totalRecords }) => {
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
    });
    const storageArray = rows.map((el) => ({
        id: el.edit,
        logistic_commission: Number(el.logistic_commission),
        distributor_price: Number(el.distributor_price),
        disabled: true,
    }));
    sessionStorage.setItem("editFields", JSON.stringify([...storageArray]));
    const custom_rows = rows.map((el) => ({
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
    setColumns(columns);
    setTotalRecords(totalRecords);
  };

  const fetchDate = async (params) => {
    setLoading(true);
    setGreenRows([]);
    setRedRows([]);
    setWhiteRows([]);
    setRows([]);
    setItems([]);
    const data = await getDate(params);
    setLoading(false);
    if (data.error) return setAllert(data.error["ajax-errors"]);
    setRenderRows(data);
  };

  const onChangeField = (id, value, fieldName) => {
    setDisabled(false);
    const storageItems = JSON.parse(sessionStorage.getItem("editFields"));
    const newArray = storageItems.map((el) => {
        if (el.id === id) {
            return fieldName === "logistic_commission"
            ?
                {
                    ...el,
                    logistic_commission: Number(value),
                    disabled: false,
                }
            :
                {
                    ...el,
                    distributor_price: Number(value),
                    disabled: false,
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

  const saveField = async (id) => {
    setLoading(true);
    const items = JSON.parse(sessionStorage.getItem("editFields")).filter((el) => !el.disabled);
    const serverItems = items.map((el) => {
        delete el.disabled;
        return el;
    });
    const find = serverItems.find((el) => el.id === id);
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
        fields: serverItems,
        filters: columnFilters,
        sorting,
        take: pagination.pageSize,
        skip: pagination.pageSize * (pagination.page - 1),
        searchText: globalFilter,
      };
    }
    setRows([]);
    const data = await editDate(params);
    setLoading(false);
    if (data.error) return setAllert(data.error["ajax-errors"]);
    setRenderRows(data);
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
      submit={saveField}
      disabled={disabled}
    />
  );
};
