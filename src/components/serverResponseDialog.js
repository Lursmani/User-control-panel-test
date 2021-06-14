import React from "react";
import { Grid, AppBar, Button } from "@material-ui/core";

export default function ErrorBox(props) {
  const textTranslations = (text) => {
    if (text === "User with same username already exists") {
      return "მომხმარებელი ამ სახელით უკვე არსებობს";
    } else return text;
  };
  const titleTranslations = (title) => {
    if (title === "FAILURE") {
      return "შეცდომა";
    } else return title;
  };

  return (
    <Grid container direction="column" justify="center">
      <Grid item>
        <AppBar position="static" color="secondary">
          <h1 style={{ padding: "0 2rem " }}>
            {titleTranslations(props.title)}
          </h1>
        </AppBar>
      </Grid>
      <Grid item style={{ padding: "2rem" }}>
        <p>{textTranslations(props.text)}</p>
      </Grid>
      <Grid container justify="center" style={{ padding: "0 0 2em 0" }}>
        <Button
          onClick={props.closeFunction}
          variant="contained"
          color="primary"
        >
          დახურვა
        </Button>
      </Grid>
    </Grid>
  );
}
