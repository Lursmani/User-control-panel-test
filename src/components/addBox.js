import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  TextField,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Dialog,
} from "@material-ui/core";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const AddBox = (props) => {
  let editMode = props.editMode;
  let userID = props.userID;
  let title = editMode ? "მომხარებლის მართვა" : "მომხმარებლის დამატება";
  const [curTab, setCurTab] = useState(0);
  const [params, setParams] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
    userGroups: [],
  });
  const [cboxError, setCboxError] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogText, setDialogText] = useState({
    message: "",
    type: "",
  })
  

  function handleDialog() {
      setDialogOpen(true)
  }

  let parseUserGroups = () => {
    let groupArr = [];
    params.userGroups.map((x) => groupArr.push(parseInt(x)));
    return groupArr;
  };

  function handleTabChange(event, newValue) {
    setCurTab(newValue);
  }

  function handleCheckboxes(event) {
    let newArr = [...params.userGroups, parseInt(event.target.value)];
    if (params.userGroups.includes(parseInt(event.target.value))) {
      newArr = newArr.filter((value) => value !== parseInt(event.target.value));
    }
    setParams({ ...params, userGroups: newArr });
  }


  useEffect(() => {
    console.log(editMode)
    console.log(userID)
    let curUserGroup = []
    if (editMode) {
      axios.get(`http://13.51.98.179:8888/users/${userID}`)
      .then(user => {
        user.data.userGroups.map(x => curUserGroup.push(x))
        setParams({...params, 
        username: user.data.username,
        fullName: user.data.fullName,
        email: user.data.email,
         userGroups: curUserGroup

         // FIX THIS FIRST 
      })})
    }
  }, [])


  function handleSubmit(e) {
    e.preventDefault();
    params.userGroups.length === 0 ? setCboxError(true) : setCboxError(false)
    if (!editMode && params.userGroups.length !== 0) {
      axios
        .post("http://13.51.98.179:8888/users", params)
        .then((response) => {console.log(response.response)
          setDialogText({...dialogText, message: response.response.data.message})  
          setDialogOpen(true)})
        .catch((error) => {console.log(error.response)
          setDialogText({...dialogText, message: error.response.data.message, type: error.response.data.type})
          setDialogOpen(true)});
    } else if (editMode && params.userGroups.length !== 0) {
      axios.put(`http://13.51.98.179:8888/users/${userID}`, params);
    }
  
  }

  function nameChange(event) {
    setParams({ ...params, username: event.target.value });
  }
  function fullNameChange(event) {
    setParams({ ...params, fullName: event.target.value });
  }
  function emailChange(event) {
    setParams({ ...params, email: event.target.value });
  }
  function passwordChange(event) {
    setParams({ ...params, password: event.target.value });
  }
  function repeatPasswordChange(event) {
    setParams({ ...params, repeatPassword: event.target.value });
  }

  useEffect(() => {
    parseUserGroups();
    let curParams = {
      username: params.username,
      fullName: params.fullName,
      email: params.email,
      password: params.password,
      repeatPassword: params.repeatPassword,
      userGroups: parseUserGroups(),
    };

    console.log(params);
    console.log(curParams);
  }, [params]);

  return (
    <Grid container>
      <Grid container justify="center">
        <h2>{title}</h2>
      </Grid>
      <AppBar position="static" style={{ margin: "0", padding: "0" }}>
        <Tabs value={curTab} onChange={handleTabChange}>
          <Tab label="მომხმარებელი" />
          <Tab label="მომხმარებლის ჯგუფები" />
        </Tabs>
      </AppBar>

      <Grid container style={{ padding: "2em" }} component={Paper}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {curTab === 0 && (
            <Grid
              container
              spacing={5}
              direction="column"
              style={{ width: "100%" }}
            >
              <Grid item style={{ width: "100%" }}>
                <TextField
                  variant="outlined"
                  onChange={nameChange}
                  value={params.username}
                  label="სახელი"
                  style={{ width: "100%" }}
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  onChange={fullNameChange}
                  value={params.fullName}
                  label="მომხმარებლის სახელი"
                  style={{ width: "100%" }}
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  onChange={emailChange}
                  value={params.email}
                  label="ელ. ფოსტა"
                  style={{ width: "100%" }}
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  onChange={passwordChange}
                  value={params.password}
                  label="პაროლი"
                  type="password"
                  style={{ width: "100%" }}
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  onChange={repeatPasswordChange}
                  value={params.repeatPassword}
                  label="გაიმეორეთ პაროლი"
                  type="password"
                  style={{ width: "100%" }}
                  required
                />
              </Grid>
            </Grid>
          )}
          {curTab === 1 && (
            <Grid container direction="column">
              <FormControl required = {params.userGroups.length !== 0 ? false : true}>
                <FormGroup >
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={1}
                        onChange={handleCheckboxes}
                        id="GroupUser"
                        checked={params.userGroups.includes(1) ? "checked" : ""}
                      />
                    }
                    label="ყველაფრის ნახვის უფლება"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={2}
                        onChange={handleCheckboxes}
                        id="GroupAdmin"
                        checked={params.userGroups.includes(2) ? "checked" : ""}
                      />
                    }
                    label="ადმინისტრატორი"
                  />
                </FormGroup>
                {cboxError && <FormHelperText  error>! აუცილებელია მინიმუმ ერთის მონიშვნა !</FormHelperText>}
              </FormControl>
            </Grid>
          )}
          <Grid container style={{ padding: "1em" }} justify="space-around">
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
            >
              Submit
            </Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <ErrorBox text = {dialogText.message} title = {dialogText.type} closeFunction={() => setDialogOpen(false)} />
            </Dialog>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};






const ErrorBox = (props) => {

  const textTranslations = (text) => {
    if (text === "User with same username already exists") {
      return "მომხმარებელი ამ სახელით უკვე არსებობს"
    }
  }
  const titleTranslations = (title) => {
    if (title === "FAILURE") {
      return "შეცდომა"
    }
  }

  return (
    <Grid container direction="column" justify="center">
      <Grid item>
        <AppBar position = "static" color = "secondary">
          <h1 style={{padding: "0 2rem "}}>{titleTranslations(props.title)}</h1>
        </AppBar>
      </Grid>
        <Grid item style={{padding: "2rem"}}>
          <p >{textTranslations(props.text)}</p>
        </Grid>
        <Grid container justify="center" style={{padding: "0 0 2em 0"}}>
          <Button onClick={props.closeFunction} variant="contained" color = "primary" >დახურვა</Button>
        </Grid>
    </Grid>
  )
}

export default AddBox;
