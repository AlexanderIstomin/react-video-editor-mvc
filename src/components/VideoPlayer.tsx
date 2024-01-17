import { Fragment, useCallback, useEffect } from "react";

import VideoPlayerControls from "./VideoPlayerControls/VideoPlayerControls";
import { useAppContext } from "../hooks/useAppContext";
import { Divider } from "@mui/material";

type TVideoPlayerProps = {
  videoSrc: string;
};

const VideoPlayer: React.FC<TVideoPlayerProps> = ({ videoSrc }) => {
  const { setVideoRef, videoRef } = useAppContext();

  const handlePlayPause = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      e?.preventDefault();

      videoRef && (videoRef.paused ? videoRef.play() : videoRef.pause());
    },
    [videoRef]
  );

  useEffect(() => {
    const playPauseOnSpacePress = (event: KeyboardEvent) => {
      if (event.key === " ") {
        handlePlayPause(event);
      }
    };

    window.addEventListener("keydown", playPauseOnSpacePress);

    return () => window.removeEventListener("keydown", playPauseOnSpacePress);
  }, [handlePlayPause]);

  return (
    <Fragment>
      <video
        playsInline
        onClick={handlePlayPause}
        ref={setVideoRef}
        src={videoSrc}
        style={{ width: "100%", marginBottom: "20px" }}
      />
      <Divider />
      <VideoPlayerControls />
    </Fragment>
  );
};

export default VideoPlayer;
