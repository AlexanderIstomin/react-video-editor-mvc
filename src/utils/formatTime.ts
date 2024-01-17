export default function formatTime(seconds: number): string {
  const isNegative = seconds < 0;
  const secondsAbs = Math.abs(seconds);
  const minutes: number = Math.floor(secondsAbs / 60);
  const remainingSeconds: number = ~~Math.floor(secondsAbs % 60);

  return `${isNegative ? "-" : ""}${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
