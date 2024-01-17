import { useEffect, useState } from "react";

import { useAppContext } from "./useAppContext";

const UPDATE_INTERVAL_MS = 1000;

export default function useGetVideoInfo() {
  const { videoRef } = useAppContext();

  const [videoInfo, setVideoInfo] = useState({
    duration: 0,
    width: 0,
    height: 0,
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (videoRef) {
      const handlePlay = () => setIsPaused(false);
      const handlePause = () => setIsPaused(true);

      videoRef.addEventListener("loadedmetadata", () => {
        setVideoInfo({
          duration: Math.floor(videoRef.duration),
          width: videoRef.videoWidth,
          height: videoRef.videoHeight,
        });

        setIsPaused(true);

        intervalId = setInterval(() => {
          const currentTime = Math.floor(~~videoRef.currentTime);

          setCurrentTime(currentTime);
        }, UPDATE_INTERVAL_MS);
      });

      videoRef.addEventListener("play", handlePlay);
      videoRef.addEventListener("pause", handlePause);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
        if (videoRef) {
          videoRef.removeEventListener("play", handlePlay);
          videoRef.removeEventListener("pause", handlePause);

          videoRef.removeEventListener("loadedmetadata", () => {
            clearInterval(intervalId);
          });
        }
      };
    }
  }, [videoRef]);

  return { ...videoInfo, currentTime, isPaused };
}
