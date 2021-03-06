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
import ErrorBox from "./serverResponseDialog"

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
  const [passwordRequired, setPasswordRequired] = useState(true);
  const [cboxError, setCboxError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState({
    message: "",
    type: "",
  });

  function handleDialog() {
    setDialogOpen(true);
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
  function handleCheckboxesEdit(event) {
    let newArr = [...params.userGroups, parseInt(event.target.value)];
    params.userGroups.map((x) => {
      if (x.id === parseInt(event.target.value)) {
        return (newArr = newArr.filter((x) => !x));
      } else if (params.userGroups.includes(parseInt(event.target.value))) {
        return (newArr = newArr.filter(
          (x) => x !== parseInt(event.target.value)
        ));
      }
    });
    setParams({ ...params, userGroups: newArr });
  }

  function checkboxChecked(boxValue) {
    if (params.userGroups.includes(boxValue)) {
      return "checked";
    } else if (params.userGroups.includes(!boxValue)) {
      return "";
    }
  }

  useEffect(() => {
    let curUserGroup = [];
    if (editMode) {
      axios.get(`${process.env.REACT_APP_USERS_API}/${userID}`).then((user) => {
        user.data.userGroups.map((x) => curUserGroup.push(x.id));
        setParams({
          ...params,
          username: user.data.username,
          fullName: user.data.fullName,
          email: user.data.email,
          userGroups: curUserGroup,

          // FIX THIS FIRST
        });
      });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    params.userGroups.length > 0 ? setCboxError(false) : setCboxError(true);
    if (!editMode && params.userGroups.length !== 0) {
      axios
        .post(`${process.env.REACT_APP_USERS_API}`, params)
        .then((response) => {
          setDialogText({
            ...dialogText,
            message: "მომხამრებელი წარმატებით შეიქმნა",
            type: "დადასტურება",
          });
          setDialogOpen(true);
        })
        .catch((error) => {
          setDialogText({
            ...dialogText,
            message: error.response.data.message,
            type: error.response.data.type,
          });
          setDialogOpen(true);
        });
    } else if (editMode && params.userGroups.length !== 0) {
      axios
        .put(`${process.env.REACT_APP_USERS_API}/${userID}`, params)
        .then((response) => {
          setDialogText({
            ...dialogText,
            message: "ცვლილებები დამახსოვრებულია",
            type: "წარმატება",
          });
          setDialogOpen(true);
        })
        .catch((error) => {
          setDialogText({
            ...dialogText,
            message: error.response.data.message,
            type: error.response.data.type,
          });
          setDialogOpen(true);
        });
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
  }, [params]);
  useEffect(() => {
    let required;

    if (editMode) {
      if (params.password === "" && params.repeatPassword === "") {
        required = false;
      } else required = true;
    } else required = true;
    setPasswordRequired(required);
  }, [params.password, params.repeatPassword]);

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
              {cboxError && (
                <FormHelperText error style={{ padding: "0 2em" }}>
                  ! აუცილებელია მინიმუმ ერთი ჯგუფის მონიშვნა !
                </FormHelperText>
              )}
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
                  type="email"
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
                  required={passwordRequired}
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
                  required={passwordRequired}
                />
              </Grid>
            </Grid>
          )}
          {curTab === 1 && (
            <Grid container direction="column">
              <FormControl
                required={params.userGroups.length !== 0 ? false : true}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={1}
                        onChange={
                          editMode ? handleCheckboxesEdit : handleCheckboxes
                        }
                        id="GroupUser"
                        checked={checkboxChecked(1)}
                      />
                    }
                    label="ყველაფრის ნახვის უფლება"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={2}
                        onChange={
                          editMode ? handleCheckboxesEdit : handleCheckboxes
                        }
                        id="GroupAdmin"
                        checked={checkboxChecked(2)}
                      />
                    }
                    label="ადმინისტრატორი"
                  />
                </FormGroup>
                {cboxError && (
                  <FormHelperText error>
                    ! აუცილებელია მინიმუმ ერთის მონიშვნა !
                  </FormHelperText>
                )}
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
              შენახვა
            </Button>
            <Button onClick={() => props.onClose()} variant="contained" color="secondary">
              დახურვა
            </Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <ErrorBox
                text={dialogText.message}
                title={dialogText.type}
                closeFunction={() => setDialogOpen(false)}
              />
            </Dialog>
            
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};


export default AddBox;
