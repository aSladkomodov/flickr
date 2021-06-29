import React from "react";
import CardWrapper from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import "./style.css";

export const Card = ({ cover, date, description, tags }) => (
  <CardWrapper className="card">
    <CardHeader subheader={date} />
    <div className="card-cover">
      <img src={cover} alt="cover" loading="lazy" />
    </div>
    <CardContent>
      <Typography variant="body2" color="textSecondary" component="p">
        Description:
        <div
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      </Typography>
    </CardContent>
    <CardContent>
      <Typography variant="body2" color="textSecondary" component="p">
        Tags: {tags}
      </Typography>
    </CardContent>
  </CardWrapper>
);
