import { useState } from "react";

import { Box } from "@mui/system";

import TranscriptionLoader from "./TranscriptionLoader";
import TranscriptionsList from "./TranscriptionsList";

type TVIdeoTranscriptionProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};
const VideoTranscriptionTab: React.FC<TVIdeoTranscriptionProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  const [transcriptFile, setTranscriptFile] = useState("");

  return (
    <Box
      height="100%"
      display="flex"
      overflow="auto"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          {!transcriptFile ? (
            <TranscriptionLoader onFileLoaded={setTranscriptFile} />
          ) : (
            <TranscriptionsList
              setTranscriptFile={setTranscriptFile}
              transcriptFile={transcriptFile}
            />
          )}
        </div>
      )}
    </Box>
  );
};

export default VideoTranscriptionTab;
