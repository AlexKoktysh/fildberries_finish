import { Box } from "@mui/material";
import { TableComponent } from "./TableComponent";
import UserDialogComponent from "./UserDialogComponent";

export const HomePage = (props) => {
    const close = () => {};

    return (
        <Box style={{ height: 1000, width: '100%', overflowY: 'auto' }}>
            <TableComponent {...props} />
            <UserDialogComponent
                disabled={props.disabled}
                openDialogText="Сохранить все"
                agreeActionFunc={props.submit}
                agreeActionText='Сохранить все'
                openedDialogTitle='Сохранение товарных позиций'
                desAgreeActionText="Отмена"
                desAgreeActionFunc={close}
                message="По кнопке «Сохранить все», будут сохранены все отредактированные записи, по кнопке «Сохранить» только 1 запись. Вы действительно хотите сохранить все изменения?"
            />
        </Box>
    );
};
