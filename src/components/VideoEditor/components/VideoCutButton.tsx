import { useCallback, useMemo } from "react";

import { Button, ButtonProps, Tooltip } from "@mui/material";
import { ContentCut } from "@mui/icons-material";

import useEditVideoFile from "../../../backend/useEditVideoFile";
import { useAppContext } from "../../../hooks/useAppContext";
import useGetVideoInfo from "../../../hooks/useGetVideoInfo";
import removeAndShiftSubtitles from "../../../utils/removeAndShiftSubtitles";

const VideoCutButton: React.FC<ButtonProps> = ({ ...buttonProps }) => {
  const {
    timelineStartTime,
    timelineEndTime,
    isProcessing,
    videoRef,
    subtitles,
    setSubtitles,
  } = useAppContext();
  const { duration } = useGetVideoInfo();
  const { cutVideo } = useEditVideoFile();

  const hasChanges = useMemo(
    () => timelineStartTime || timelineEndTime !== duration,
    [duration, timelineEndTime, timelineStartTime]
  );

  const handleApplychanges = useCallback(async () => {
    const operations: Array<[number, number]> = [];

    if (timelineStartTime > 0) {
      operations.push([0, timelineStartTime]);
    }

    if (timelineEndTime < duration) {
      operations.push([timelineEndTime, duration]);
    }

    const resultBlobUrl = await cutVideo(operations);

    if (subtitles?.length) {
      const newSubtitles = removeAndShiftSubtitles(subtitles, [
        [timelineStartTime, timelineEndTime],
      ]);
      setSubtitles(newSubtitles);
    }

    if (!resultBlobUrl || !videoRef) {
      return;
    }

    videoRef.src = resultBlobUrl;
  }, [
    cutVideo,
    duration,
    setSubtitles,
    subtitles,
    timelineEndTime,
    timelineStartTime,
    videoRef,
  ]);

  return (
    <Tooltip
      arrow
      disableFocusListener
      placement="top"
      title="Cuts the selected part of the video"
    >
      <span>
        <Button
          sx={{ textTransform: "none" }}
          disabled={!hasChanges || isProcessing}
          startIcon={<ContentCut color="inherit" />}
          size="small"
          variant="contained"
          onClick={handleApplychanges}
          {...buttonProps}
        >
          Cut
        </Button>
      </span>
    </Tooltip>
  );
};

export default VideoCutButton;
