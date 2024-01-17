import { Fragment, useCallback, useEffect } from "react";
import { Box, Button } from "@mui/material";

import parseSRT from "../../../../../utils/parseSRT";
import SubtitleItem from "./SubtitleItem";

import type TTranscription from "../../../../../types/TTranscription";
import { useAppContext } from "../../../../../hooks/useAppContext";

type TTranscriptFileProps = {
  transcriptFile: string;
  setTranscriptFile: (file: string) => void;
};

const TranscriptionsList: React.FC<TTranscriptFileProps> = ({
  transcriptFile,
  setTranscriptFile,
}) => {
  const {
    setTimelineStartTime,
    setTimelineEndTime,
    setCurrentSeekTime,
    videoRef,
    subtitles,
    setSubtitles,
    isProcessing,
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

  useEffect(() => {
    if (transcriptFile) {
      setSubtitles(parseSRT(transcriptFile));
    }
  }, [setSubtitles, transcriptFile]);

  if (!subtitles?.length) {
    return (
      <Box>
        Something went wrong.
        <Button onClick={() => setTranscriptFile("")}>Try again</Button>
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
