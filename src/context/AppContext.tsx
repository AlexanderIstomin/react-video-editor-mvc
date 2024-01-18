import React, { useCallback, useEffect, useMemo, useState } from "react";

import type TTranscription from "../types/TTranscription";

export type TAppContext = {
  timelineStartTime: number;
  setTimelineStartTime: (value: number) => void;
  currentSeekTime: number;
  setCurrentSeekTime: (value: number) => void;
  timelineEndTime: number;
  setTimelineEndTime: (value: number) => void;
  videoRef: HTMLVideoElement | null;
  setVideoRef: (instance: HTMLVideoElement | null) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  resetEditState: () => void;
  mobileSidebarToggle: (status?: boolean) => void;
  setIsSidebarClosing: (value: boolean) => void;
  isMobileSidebarOpen: boolean;
  subtitles: TTranscription[] | null;
  setSubtitles: (subtitles: TTranscription[] | null) => void;
  setIsLogoEditorOpen: (value: boolean) => void;
  isLogoEditorOpen: boolean;
  logoEditorToggle: (status?: boolean) => void;
};

export const AppContext = React.createContext<TAppContext | null>(null);

export default function AppContextProvider({
  children,
}: React.PropsWithChildren) {
  const [timelineStartTime, setTimelineStartTime] = useState(0);
  const [currentSeekTime, setCurrentSeekTime] = useState(0);
  const [timelineEndTime, setTimelineEndTime] = useState(0);
  const [videoRef, _setVideoRef] = useState<TAppContext["videoRef"]>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarClosing, setIsSidebarClosing] = useState(false);

  const [isLogoEditorOpen, setIsLogoEditorOpen] = useState(false);

  const [subtitles, setSubtitles] = useState<TAppContext["subtitles"]>(null);

  const resetEditState = useCallback(() => {
    setCurrentSeekTime(0);
    setTimelineStartTime(0);
    videoRef?.duration && setTimelineEndTime(videoRef?.duration);
  }, [videoRef]);

  const mobileSidebarToggle = useCallback<TAppContext["mobileSidebarToggle"]>(
    (status) => {
      if (status !== undefined) {
        return setIsMobileSidebarOpen(status);
      }

      if (!isSidebarClosing) {
        setIsMobileSidebarOpen((open) => !open);
      }
    },
    [isSidebarClosing]
  );

  const logoEditorToggle = useCallback<TAppContext["logoEditorToggle"]>(
    (status) => {
      if (status !== undefined) {
        return setIsLogoEditorOpen(status);
      }

      if (!isSidebarClosing) {
        setIsLogoEditorOpen((open) => !open);
      }
    },
    [isSidebarClosing]
  );

  const observer = useMemo(
    () =>
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "src"
          ) {
            resetEditState();
          }
        }
      }),
    [resetEditState]
  );

  useEffect(() => {
    if (videoRef) {
      videoRef.addEventListener("loadedmetadata", () => {
        const duration = ~~Math.floor(videoRef?.duration);
        setTimelineEndTime(duration);
      });

      observer.observe(videoRef, { attributes: true });
    }

    return () => observer.disconnect();
  }, [observer, videoRef]);

  const setVideoRef = useCallback<TAppContext["setVideoRef"]>((ref) => {
    if (ref) {
      _setVideoRef(ref);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        timelineStartTime,
        setTimelineStartTime,
        timelineEndTime,
        setTimelineEndTime,
        videoRef,
        setVideoRef,
        isProcessing,
        setIsProcessing,
        currentSeekTime,
        setCurrentSeekTime,
        resetEditState,
        mobileSidebarToggle,
        setIsSidebarClosing,
        isMobileSidebarOpen,
        subtitles,
        setSubtitles,
        isLogoEditorOpen,
        setIsLogoEditorOpen,
        logoEditorToggle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
