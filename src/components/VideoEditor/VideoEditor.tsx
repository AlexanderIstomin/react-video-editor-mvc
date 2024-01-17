import { Box } from "@mui/material";

import VideoEditorCurrentTime from "./components/VideoEditorCurrentTime";
import VideoEditorTimeline from "./components/VideoEditorTimeline";
import VideoEditorToolbar from "./components/VideoEditorToolbar";

const VideoEditor: React.FC = () => {
  return (
    <Box sx={{ px: 1 }}>
      <VideoEditorToolbar />
      <VideoEditorCurrentTime />
      <VideoEditorTimeline />
    </Box>
  );
};

export default VideoEditor;
