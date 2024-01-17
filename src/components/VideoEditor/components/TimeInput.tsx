import React, { useCallback, useEffect, useState } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

import formatTime from "../../../utils/formatTime";
import convertToSeconds from "../../../utils/convertStringToSeconds";

export type TTimeInputProps = Omit<TextFieldProps, "onBlur"> & {
  onBlur?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    totalSeconds: number
  ) => void;
};

const TimeInput: React.FC<TTimeInputProps> = ({
  value = "",
  onBlur,
  ...inputProps
}) => {
  const [time, setTime] = useState("");

  const handleTimeChange = useCallback<NonNullable<TextFieldProps["onChange"]>>(
    (event) => {
      let { value } = event.target;

      const parts = value.split(":").map(Number);

      let totalSeconds = isNaN(parts[0]) ? 0 : parts[0] * 60 + ~~parts[1];

      if ((parts.length === 2 && isNaN(parts[1])) || isNaN(parts[0])) {
        return;
      }

      if (parts.length === 2 && isNaN(parts[0])) {
        totalSeconds = 0;
      }

      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        totalSeconds = parts[0] * 60 + parts[1];
      }

      if (parts.length === 2 && !isNaN(parts[1]) && parts[1] > 60) {
        value = formatTime(totalSeconds);
      }

      setTime(String(value));
    },
    []
  );

  const handleBlur = useCallback<NonNullable<TextFieldProps["onBlur"]>>(
    (event) => {
      onBlur?.(event, convertToSeconds(time));
    },
    [onBlur, time]
  );

  useEffect(() => {
    setTime(String(value));
  }, [value]);

  return (
    <TextField
      label="Time (mm:ss)"
      placeholder="mm:ss"
      value={time}
      onChange={handleTimeChange}
      inputProps={{ maxLength: 6, pattern: "[0-9][0-9][0-9]:[0-5][0-9]" }}
      size="small"
      onBlur={handleBlur}
      {...inputProps}
    />
  );
};

export default TimeInput;
