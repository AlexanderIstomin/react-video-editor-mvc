import { useCallback } from "react";
import { Box, Button } from "@mui/material";

import SubtitleItem from "./SubtitleItem";

import type TTranscription from "../../../../../types/TTranscription";
import { useAppContext } from "../../../../../hooks/useAppContext";

const TranscriptionsList: React.FC = () => {
  const {
    setTimelineStartTime,
    setTimelineEndTime,
    setCurrentSeekTime,
    videoRef,
    subtitles,
    isProcessing,
    setSubtitles,
  } = useAppContext();

  const handleSubtitleClick = useCallback(
    ({ startTimeInSeconds, endTimeInSeconds }: TTranscription) => {
      if (isProcessing) {
        return;
      }

      setTimelineStartTime(startTimeInSeconds);
      setTimelineEndTime(endTimeInSeconds);
      setCurrentSeekTime(startTimeInSeconds);
      videoRef && (videoRef.currentTime = startTimeInSeconds);
    },
    [
      isProcessing,
      setCurrentSeekTime,
      setTimelineEndTime,
      setTimelineStartTime,
      videoRef,
    ]
  );

  if (!subtitles?.length) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Something went wrong.
        <Button onClick={() => setSubtitles(null)}>Try again</Button>
      </Box>
    );
  }

  return (
    <>
      {subtitles?.map((subtitle) => (
        <SubtitleItem
          key={subtitle.startTimeInSeconds}
          item={subtitle}
          onClick={handleSubtitleClick}
        />
      ))}
    </>
  );
};

export default TranscriptionsList;
