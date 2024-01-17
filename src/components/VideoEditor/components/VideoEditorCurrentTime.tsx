import { useCallback, useEffect } from "react";
import Slider, { SliderProps } from "@mui/material/Slider";

import useGetVideoInfo from "../../../hooks/useGetVideoInfo";
import formatTime from "../../../utils/formatTime";
import { useAppContext } from "../../../hooks/useAppContext";

const SEEK_STEP = 1;

const VideoEditorCurrentTime: React.FC = () => {
  const { currentSeekTime, setCurrentSeekTime, videoRef, isProcessing } =
    useAppContext();

  const { currentTime, duration } = useGetVideoInfo();

  const handleTimelineChange = useCallback<
    NonNullable<SliderProps["onChange"]>
  >(
    (e, value) => {
      e.preventDefault();

      const seek = value as number;

      setCurrentSeekTime(seek);

      if (videoRef) {
        videoRef.currentTime = seek;
      }
    },
    [setCurrentSeekTime, videoRef]
  );

  useEffect(() => {
    setCurrentSeekTime(currentTime);
  }, [currentTime, setCurrentSeekTime]);

  useEffect(() => {
    const seekOnArrowPress = (event: KeyboardEvent) => {
      let nextStep = 0;

      if (event.key === "ArrowRight") {
        nextStep = currentSeekTime + SEEK_STEP;
      }

      if (event.key === "ArrowLeft") {
        nextStep = currentSeekTime - SEEK_STEP;
      }

      if (nextStep > 0 && nextStep < duration) {
        handleTimelineChange(event, nextStep, 0);
      }
    };

    window.addEventListener("keydown", seekOnArrowPress);

    return () => window.removeEventListener("keydown", seekOnArrowPress);
  }, [currentSeekTime, duration, handleTimelineChange, setCurrentSeekTime]);

  return (
    <Slider
      marks
      track={false}
      disabled={isProcessing}
      sx={{
        top: 8,
        height: 30,
        padding: "0 !important",
        borderRadius: 0,
        color: "#55aaff",
        "& .MuiSlider-mark": {
          height: "6px",
          width: "1px",
          transform: "translate(0, -50%)",
        },
        "& .MuiSlider-mark:nth-of-type(10n)": {
          height: "10px",
        },
        "& .MuiSlider-thumb": {
          cursor: "col-resize",
          border: "none",
          top: 0,
          transform: "translateX(-50%)",
          "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
            boxShadow: "inherit",
          },
          height: 110,
          zIndex: 2,
          width: 10,
          backgroundColor: "transparent",
          borderRadius: 0,
          "&:before": {
            display: "block",
            content: "''",
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #e20000",
            width: 0,
            height: 0,
            top: 0,
            boxShadow: "none",
          },
          "&:after": {
            display: "block",
            content: "''",
            left: 4,
            top: 0,
            height: "100%",
            background: "#e20000",
            transform: "none",
            width: 2,
            borderRadius: 0,
          },
        },
        "& .MuiSlider-track": {
          borderRadius: "5px",
        },
      }}
      min={0}
      max={duration}
      step={SEEK_STEP}
      value={currentSeekTime}
      valueLabelDisplay="auto"
      valueLabelFormat={formatTime}
      onChange={handleTimelineChange}
    />
  );
};

export default VideoEditorCurrentTime;
