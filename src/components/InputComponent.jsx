import { useState } from "react";
import { TextField } from "@mui/material";

export const InputComponent = ({ defaultValue, onChangeField, id, fields }) => {
    const [value, setValue] = useState(defaultValue);
    const onChange = (value) => {
        setValue(value);
        onChangeField(id, value, fields)
    };

    return (
        <TextField
            sx={{ marginY: "20px", width: "100%" }}
            label="Количество"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            size="small"
        />
    );
};