import { useCallback, useState } from "react";

import formatTime from "../../../utils/formatTime";
import { useAppContext } from "../../../hooks/useAppContext";
import TimeInput from "./TimeInput";
import useGetVideoInfo from "../../../hooks/useGetVideoInfo";

import type { TTimeInputProps } from "./TimeInput";

const VideoEditorEndTimeInput: React.FC<TTimeInputProps> = (props) => {
  const {
    timelineStartTime,
    setTimelineEndTime,
    timelineEndTime,
    isProcessing,
  } = useAppContext();
  const { duration } = useGetVideoInfo();

  const [error, setError] = useState("");

  const handleBlur = useCallback<NonNullable<TTimeInputProps["onBlur"]>>(
    (_, endPosition) => {
      if (endPosition <= duration && endPosition > timelineStartTime) {
        setError("");
        return setTimelineEndTime(endPosition);
      }

      setError("Invalid time");
    },
    [duration, setTimelineEndTime, timelineStartTime]
  );

  const value = formatTime(timelineEndTime);

  return (
    <TimeInput
      disabled={isProcessing}
      error={!!error}
      label={error || "End time"}
      value={value}
      onBlur={handleBlur}
      {...props}
    />
  );
};

export default VideoEditorEndTimeInput;
