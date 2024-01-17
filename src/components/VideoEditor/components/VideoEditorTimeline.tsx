import { useCallback, useEffect } from "react";
import Slider, { SliderProps } from "@mui/material/Slider";

import useGetVideoInfo from "../../../hooks/useGetVideoInfo";
import formatTime from "../../../utils/formatTime";
import { useAppContext } from "../../../hooks/useAppContext";

const START = 0;
const END = 1;

const VideoEditorTimeline: React.FC = () => {
  const {
    setTimelineStartTime,
    timelineStartTime,
    setTimelineEndTime,
    timelineEndTime,
    setCurrentSeekTime,
    isProcessing,
    currentSeekTime,
    videoRef,
  } = useAppContext();

  const { currentTime, duration } = useGetVideoInfo();

  const handleTimelineChange = useCallback<
    NonNullable<SliderProps["onChange"]>
  >(
    (e, values, activeThumb) => {
      e.preventDefault();

      const [startTime, endTime] = values as number[];

      if (e.type === "mousedown" || e.type === "touchstart") {
        return;
      }

      switch (activeThumb) {
        case START:
          setTimelineStartTime(startTime);
          break;
        case END:
          setTimelineEndTime(endTime);
          break;
      }
    },
    [setTimelineEndTime, setTimelineStartTime]
  );

  const handleChangecommit = useCallback<
    NonNullable<SliderProps["onChangeCommitted"]>
  >(
    (e, values) => {
      e.preventDefault();

      const [startTime, endTime] = values as number[];

      if (!videoRef) {
        return;
      }

      if (currentSeekTime < startTime) {
        setCurrentSeekTime(startTime);
        videoRef.currentTime = startTime;
      }

      if (currentSeekTime > endTime) {
        setCurrentSeekTime(endTime);
        videoRef.currentTime = endTime;
      }
    },
    [currentSeekTime, setCurrentSeekTime, videoRef]
  );

  useEffect(() => {
    setCurrentSeekTime(currentTime);
  }, [currentTime, setCurrentSeekTime]);

  return (
    <Slider
      disabled={isProcessing}
      sx={{
        height: 80,
        padding: "0 !important",
        borderRadius: 0,
        "& .MuiSlider-thumb": {
          zIndex: 3,
          cursor: "col-resize",
          border: "none",
          top: 0,
          transform: "translateX(-50%)",
          height: 80,
          width: 10,
          backgroundColor: "#ff7800",
          borderRadius: 5,
          opacity: 0.95,
          boxShadow: "0 0 2px 1px #bebebe",
          "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
            boxShadow: "inherit",
          },
          "&::before, &::after": {
            display: "none",
          },
        },

        "& .MuiSlider-track": {
          borderRadius: "5px",
        },
      }}
      min={0}
      max={duration}
      step={1}
      value={[timelineStartTime, timelineEndTime]}
      valueLabelDisplay="auto"
      valueLabelFormat={formatTime}
      onChange={handleTimelineChange}
      onChangeCommitted={handleChangecommit}
    />
  );
};

export default VideoEditorTimeline;
