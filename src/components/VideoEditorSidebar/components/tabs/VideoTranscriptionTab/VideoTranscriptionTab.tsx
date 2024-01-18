import { Box } from "@mui/system";

import TranscriptionLoader from "./TranscriptionLoader";
import TranscriptionsList from "./TranscriptionsList";
import { useAppContext } from "../../../../../hooks/useAppContext";

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
  const { subtitles } = useAppContext();

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
        <div style={{ width: "100%" }}>
          {!subtitles?.length ? (
            <TranscriptionLoader />
          ) : (
            <TranscriptionsList />
          )}
        </div>
      )}
    </Box>
  );
};

export default VideoTranscriptionTab;
