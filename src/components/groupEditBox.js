import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  TextField,
  Paper,
  Checkbox,FormGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Dialog,
  Switch,
} from "@material-ui/core";
import axios from "axios";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import ErrorBox from "./serverResponseDialog";

const GroupEditBox = (props) => {
  const [params, setParams] = useState({
    name: "",
    active: "",
    userPermissionCodes: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState({
    message: "",
    type: "",
  });




  useEffect(() => {
      setEditMode(props.editMode)
    axios
      .get(`${process.env.REACT_APP_USERGROUPS_API}/${props.groupID}`)
      .then((response) =>
        setParams({
          ...params,
          name: response.data.name,
          active: response.data.active,
          userPermissionCodes: response.data.userPermissionCodes,
        })
      );
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (editMode) {
      axios
        .put(`${process.env.REACT_APP_USERGROUPS_API}/${props.groupID}`, params)
        .then((response) =>
          {setDialogText({
            ...dialogText,
            message: "ცვლილებები წარმატებით შესრულდა",
            type: "დადასტურება",
          })
          setDialogOpen(true)}
        )
        .catch((error) => {
          setDialogText({
            ...dialogText,
            message: error.response.data.message,
            type: error.response.data.type,
          });
          setDialogOpen(true);
        });
    } else if (!editMode) {
      axios
        .post(`${process.env.REACT_APP_USERGROUPS_API}`, params)
        .then((response) =>
          {setDialogText({
            ...dialogText,
            message: "ცვლილებები წარმატებით შესრულდა",
            type: "დადასტურება",
          })
            setDialogOpen(true)}
        )
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

  function  handleDialogclose() {
      setDialogOpen(false)
      setDialogText({
          message: "",
          type: ""
      })
  }


  function isChecked(value) {
    if (params.userPermissionCodes.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  function bothChecked(subVal1, subVal2) {
    if (
      params.userPermissionCodes.includes(subVal1) &&
      params.userPermissionCodes.includes(subVal2)
    ) {
      return true;
    } else return false;
  }

  function handleCheckboxes(event) {
    let newArr = [...params.userPermissionCodes, event.target.value];
    if (params.userPermissionCodes.includes(event.target.value)) {
      newArr = newArr.filter((permission) => permission !== event.target.value);
    }
    setParams({ ...params, userPermissionCodes: newArr });
  }


  return (
    <Grid container style={{ padding: "1rem" }}>
      <Grid container style={{ padding: "0 1rem" }}>
        <h2>მომხმარებელთა ჯგუფების მართვა</h2>
      </Grid>

      <Grid container style={{ padding: "1rem", width: "100%" }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container xs={12} justify="space-between">
            <Grid container xs={7}>
              <TextField
                fullWidth
                label="სახელი"
                variant="outlined"
                value={params.name}
                onChange={(event) =>
                  setParams({ ...params, name: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={params.active}
                    onChange={() =>
                      setParams({ ...params, active: !params.active })
                    }
                  />
                }
                label={params.active ? "აქტიური" : "არააქტიური"}
              />
            </Grid>
          </Grid>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <FormControl>
              <TreeItem
                nodeId="1"
                label={
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="All_users"
                        checked={bothChecked("USERS_MANAGE", "USERS_VIEW")}
                      />
                    }
                    label="მომხმარებლები"
                  />
                }
              >
                <Box
                  id="2"
                  value="USERS_MANAGE"
                  onChange={handleCheckboxes}
                  isChecked={isChecked}
                  label="მომხმარებელთა მართვა"
                />

                <Box
                  id="3"
                  value="USERS_VIEW"
                  onChange={handleCheckboxes}
                  isChecked={isChecked}
                  label="მომხმარებელთა ნახვა"
                />
              </TreeItem>

              <TreeItem
                nodeId="4"
                label={
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="All_User_Groups"
                        checked={bothChecked(
                          "USER_GROUPS_MANAGE",
                          "USER_GROUPS_VIEW"
                        )}
                      />
                    }
                    label="მომხმარებლის ჯგუფები"
                  />
                }
              >
                <Box
                  id="5"
                  value="USER_GROUPS_MANAGE"
                  onChange={handleCheckboxes}
                  isChecked={isChecked}
                  label="მომხმარებლის ჯგუფების მართვა"
                />

                <Box
                  id="6"
                  value="USER_GROUPS_VIEW"
                  onChange={handleCheckboxes}
                  isChecked={isChecked}
                  label="მომხმარებლის ჯგუფების ნახვა"
                />
              </TreeItem>

              <TreeItem
                nodeId="7"
                label={
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="All_Sys"
                        checked={bothChecked(
                          "SYS_PARAMS_MANAGE",
                          "SYS_PARAMS_VIEW"
                        )}
                      />
                    }
                    label="სისტემური პარამეტრები"
                  />
                }
              >
                <Box
                  id="8"
                  value="SYS_PARAMS_MANAGE"
                  onChange={handleCheckboxes}
                  isChecked={isChecked}
                  label="სისტემური პარამეტრების მართვა"
                />

                <Box
                  id="9"
                  value="SYS_PARAMS_VIEW"
                  onChange={handleCheckboxes}
                  isChecked={isChecked}
                  label="სისტემური პარამეტრების ნახვა"
                />
              </TreeItem>
              <TreeItem
                nodeId="10"
                label={
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="All_users"
                        checked={bothChecked("MEMBERS_MANAGE", "MEMBERS_VIEW")}
                      />
                    }
                    label="წევრები"
                  />
                }
              >
                <Box
                  id="11"
                  value="MEMBERS_MANAGE"
                  onChange={handleCheckboxes}
                  isChecked={isChecked}
                  label="წევრების მართვა"
                />

                <Box
                  id="12"
                  value="MEMBERS_VIEW"
                  onChange={handleCheckboxes}
                  isChecked={isChecked}
                  label="წევრების ნახვა"
                />
              </TreeItem>

              <TreeItem
                nodeId="13"
                label={
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="All_users"
                        checked={bothChecked(
                          "CAR_ACCIDENTS_MANAGE",
                          "CAR_ACCIDENTS_VIEW"
                        )}
                      />
                    }
                    label="ავტოსაგზაო შემთხვევები"
                  />
                }
              >
                <Box
                  id="14"
                  value="CAR_ACCIDENTS_MANAGE"
                  onChange={handleCheckboxes}
                  isChecked={isChecked}
                  label="ავტოსაგზაო შემთხვევების მართვა"
                />

                <Box
                  id="15"
                  value="CAR_ACCIDENTS_VIEW"
                  onChange={handleCheckboxes}
                  isChecked={isChecked}
                  label="ავტოსაგზაო შემთხვევების ნახვა"
                />
              </TreeItem>
            </FormControl>
          </TreeView>
          <Grid container justify="space-around">
            <Button variant="contained" color="primary" type="submit">
              შენახვა
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => props.onClose()}
            >
              დახურვა
            </Button>
          </Grid>
        </form>
      </Grid>
      <Dialog open={dialogOpen} onClose={() => handleDialogclose()}>
        <ErrorBox
          text={dialogText.message}
          title={dialogText.type}
          closeFunction={() => setDialogOpen(false)}
        />
      </Dialog>
      
    </Grid>
  );
};

function Box(props) {
  return (
    <TreeItem
      nodeId={props.id}
      label={
        <FormControlLabel
          control={
            <Checkbox
              value={props.value}
              onChange={props.onChange}
              checked={props.isChecked(props.value)}
            />
          }
          label={props.label}
        />
      }
    />
  );
}

export default GroupEditBox;
