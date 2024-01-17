import { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";
import VideoTranscriptionTab from "./tabs/VideoTranscriptionTab/VideoTranscriptionTab";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const VideoEditorSidebar: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          scrollButtons="auto"
          value={value}
          onChange={handleChange}
          aria-label="Video Editor Sidebar Tabs"
        >
          <Tab label="Transcript" {...a11yProps(0)} />
        </Tabs>
      </Box>
      <VideoTranscriptionTab value={value} index={0} />
    </Box>
  );
};

export default VideoEditorSidebar;
