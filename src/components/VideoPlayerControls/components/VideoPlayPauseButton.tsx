import { useCallback, useMemo } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Button, ButtonProps, CircularProgress } from "@mui/material";

import useGetVideoInfo from "../../../hooks/useGetVideoInfo";
import formatTime from "../../../utils/formatTime";
import { useAppContext } from "../../../hooks/useAppContext";

const VideoPlayPausebutton: React.FC<ButtonProps> = (props) => {
  const { videoRef, isProcessing } = useAppContext();
  const { currentTime, isPaused } = useGetVideoInfo();

  const handleVideoPlayPause = useCallback(() => {
    videoRef && (videoRef.paused ? videoRef.play() : videoRef.pause());
  }, [videoRef]);

  const buttonIcon = useMemo(() => {
    if (isProcessing) {
      return <CircularProgress size={14} color="inherit" />;
    }

    if (isPaused) {
      return <PlayArrowIcon />;
    }

    return <PauseIcon />;
  }, [isPaused, isProcessing]);

  return (
    <Button
      disabled={isProcessing}
      size="small"
      variant="contained"
      startIcon={buttonIcon}
      onClick={handleVideoPlayPause}
      {...props}
    >
      {formatTime(currentTime)}
    </Button>
  );
};

export default VideoPlayPausebutton;
