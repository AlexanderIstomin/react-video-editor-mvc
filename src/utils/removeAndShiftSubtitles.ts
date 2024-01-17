import type TTimeRange from "../types/TTimeRange";
import type TTranscription from "../types/TTranscription";

function removeAndShiftSubtitles(
  subtitles: TTranscription[],
  timeRanges: TTimeRange[]
): TTranscription[] {
  // Sort and combine overlapping time ranges
  const combinedRanges = combineOverlappingRanges(
    timeRanges.sort((a, b) => a[0] - b[0])
  );

  return subtitles
    .filter((subtitle) => {
      // Check if the subtitle overlaps with any of the ranges
      for (const [start, end] of combinedRanges) {
        if (
          subtitle.startTimeInSeconds < end &&
          subtitle.endTimeInSeconds > start
        ) {
          return false; // Exclude subtitles that overlap with the ranges
        }
      }
      return true;
    })
    .map((subtitle) => {
      // Calculate the total shift up to this subtitle's start time
      const shiftUpToSubtitle = combinedRanges.reduce((shift, [start, end]) => {
        return subtitle.startTimeInSeconds >= end
          ? shift + (end - start)
          : shift;
      }, 0);

      return {
        ...subtitle,
        startTimeInSeconds: subtitle.startTimeInSeconds - shiftUpToSubtitle,
        endTimeInSeconds: subtitle.endTimeInSeconds - shiftUpToSubtitle,
      };
    });
}

function combineOverlappingRanges(ranges: TTimeRange[]): TTimeRange[] {
  const combinedRanges: TTimeRange[] = [];
  let currentRange: TTimeRange | null = null;

  for (const range of ranges) {
    if (!currentRange) {
      currentRange = range;
    } else if (currentRange[1] >= range[0]) {
      currentRange[1] = Math.max(currentRange[1], range[1]);
    } else {
      combinedRanges.push(currentRange);
      currentRange = range;
    }
  }
  if (currentRange) {
    combinedRanges.push(currentRange);
  }

  return combinedRanges;
}

export default removeAndShiftSubtitles;
