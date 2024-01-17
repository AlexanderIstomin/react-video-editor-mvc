import { Fragment, memo, useMemo } from "react";

import { CardContent, Card, Typography } from "@mui/material";

import type TTranscription from "../../../../../types/TTranscription";
import formatTime from "../../../../../utils/formatTime";

type TSubtitleItemProps = {
  item: TTranscription;
  onClick?: (item: TTranscription) => void;
};

const SubtitleItem: React.FC<TSubtitleItemProps> = ({ item, onClick }) => {
  const { startTimeInSeconds, endTimeInSeconds, text } = item;

  const formattedTime = useMemo(() => {
    return `${formatTime(startTimeInSeconds)} - ${formatTime(
      endTimeInSeconds
    )}`;
  }, [endTimeInSeconds, startTimeInSeconds]);

  const card = (
    <Fragment>
      <CardContent onClick={() => onClick?.(item)}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {formattedTime}
        </Typography>
        <Typography variant="body2">{text}</Typography>
      </CardContent>
    </Fragment>
  );

  return (
    <Card
      sx={{
        minWidth: 280,
        minHeight: 168,
        border: "none",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: 0,
        cursor: "pointer",
      }}
      variant="outlined"
    >
      {card}
    </Card>
  );
};

export default memo(SubtitleItem);
