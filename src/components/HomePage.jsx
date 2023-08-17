import { Box } from "@mui/material";
import { TableComponent } from "./TableComponent";

export const HomePage = (props) => {
    return (
        <Box style={{ height: 1000, width: '100%', overflowY: 'auto' }}>
            <TableComponent {...props} />
        </Box>
    );
};
