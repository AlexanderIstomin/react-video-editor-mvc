import { useCallback, useState } from "react";

import formatTime from "../../../utils/formatTime";
import { useAppContext } from "../../../hooks/useAppContext";
import TimeInput from "./TimeInput";

import type { TTimeInputProps } from "./TimeInput";

const VideoEditorStartTimeInput: React.FC<TTimeInputProps> = (props) => {
  const {
    timelineStartTime,
    setTimelineStartTime,
    timelineEndTime,
    isProcessing,
  } = useAppContext();

  const [error, setError] = useState("");

  const handleBlur = useCallback<NonNullable<TTimeInputProps["onBlur"]>>(
    (_, startPosition) => {
      if (startPosition >= 0 && startPosition < timelineEndTime) {
        setError("");
        return setTimelineStartTime(startPosition);
      }

      setError("Invalid time");
    },
    [setTimelineStartTime, timelineEndTime]
  );

  return (
    <TimeInput
      disabled={isProcessing}
      error={!!error}
      label={error || "Start time"}
      value={formatTime(timelineStartTime)}
      onBlur={handleBlur}
      {...props}
    />
  );
};

export default VideoEditorStartTimeInput;
