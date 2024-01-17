import Grid from "@mui/system/Unstable_Grid";

import VideoPlayPausebutton from "./components/VideoPlayPauseButton";
import VideoTrimButton from "../VideoEditor/components/VideoTrimButton";
import VideoEditorStartTimeInput from "../VideoEditor/components/VideoEditorStartTimeInput";
import VideoEditorEndTimeInput from "../VideoEditor/components/VideoEditorEndTimeInput";
import VideoCutButton from "../VideoEditor/components/VideoCutButton";
import VideoDownloadButton from "../VideoEditor/components/VideoDownloadButton";

const VideoPlayerControls: React.FC = () => {
  return (
    <Grid
      container
      spacing={0}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 1,
        p: 1,
        width: "100%",
      }}
    >
      <Grid
        xs={12}
        md
        sx={{
          display: "flex",
          gap: 1,
          alignContent: "stretch",
          justifyContent: "end",
        }}
      >
        <VideoPlayPausebutton sx={{ ml: 0, mr: "auto" }} />
        <VideoEditorStartTimeInput
          sx={{ maxWidth: "148px", "& input": { fontSize: "16px" } }}
        />
        <VideoEditorEndTimeInput
          sx={{ maxWidth: "148px", "& input": { fontSize: "16px" } }}
        />
      </Grid>
      <Grid
        xs={12}
        md={4}
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "end",
          alignContent: "stretch",
          "& button": {
            height: "100%",
          },
        }}
      >
        <VideoTrimButton />
        <VideoCutButton />
        <VideoDownloadButton />
      </Grid>
    </Grid>
  );
};

export default VideoPlayerControls;
