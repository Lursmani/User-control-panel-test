import React, { useState, useEffect } from "react";
import axios from "axios";
import EditBox from "./groupEditBox"
import Grid from "@material-ui/core/Grid";
import { makeStyles, Paper, TextField, Button } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Dialog,
  Switch
} from "@material-ui/core";
import "./CSS/users.css";
import { Autocomplete } from "@material-ui/lab";
import EditIcon from "@material-ui/icons/Edit";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import FiberManualRecordOutlinedIcon from "@material-ui/icons/FiberManualRecordOutlined";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import AddIcon from "@material-ui/icons/Add";
import DeleteBox from "./groupDeleteBox"

const classes = makeStyles({
  tableHeader: {
    background: "#d4d6d9",
  },
});

const UserGroups = (props) => {
  const [groupData, setGroupData] = useState();
  const styles = classes();
  //   FILTER STATE
  const [fText, setfText] = useState("");
  const [fPermissions, setfPermissions] = useState();
  const [fActive, setfActive] = useState("");
  const [editingGroupID, setEditingGroupID] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)


  function handleDeleteOpen(groupID) {
    setDeleteOpen(true)
    setEditingGroupID(groupID)
  }
  function handleDeleteClose() {
    setDeleteOpen(false)
    setEditingGroupID(null)
  }



console.log(groupData)
  function formatDate(rawDate) {
    const date = rawDate.match(/.*(?=T)/);
    const time = rawDate.match(/(?<=T).*(?=\.)/);

    return `${date} ${time}`;
  }

  const comboStatus = [
    { name: "აქტიური", value: true },
    { name: "არააქტიური", value: false },
    { name: "აქტიური/არააქტიური", value: "" },
  ];
  const comboPermissions = [
    { name: "ყველა", value: undefined },
    { name: "ავარიების მართვა", value: "CAR_ACCIDENTS_MANAGE" },
    { name: "ავარიების ნახვა", value: "CAR_ACCIDENTS_VIEW" },
    { name: "ჯგუფების მართვა", value: "USER_GROUPS_MANAGE" },
    { name: "ჯგუფების ნახვა", value: "USER_GROUPS_VIEW" },
    { name: "წევრების მართვა", value: "MEMBERS_MANAGE" },
    { name: "წევრების ნახვა", value: "MEMBERS_VIEW" },
    { name: "სისტემური პარამეტრების მართვა", value: "SYS_PARAMS_MANAGE" },
    { name: "სისტემური პარამეტრების ნახვა", value: "SYS_PARAMS_VIEW" },
    { name: "მომხმარებლების მართვა", value: "USERS_MANAGE" },
    { name: "მომხმარებლების ნახვა", value: "USERS_VIEW" },
  ];

  function handleSubmit() {

    axios
      .get(`${process.env.REACT_APP_USERGROUPS_API}`, {
        params: {
          active: fActive,
          name: fText,
          ...(fPermissions ? { permissionCode: fPermissions } : {}),
        },
      })
      .then((res) => setGroupData(res.data))
  }

 

 
 


  function handleGroupAddOpen() {
    setDialogOpen(true)
    setEditMode(false)
  }
  function handleGroupEditOpen(groupID) {
    setEditingGroupID(groupID)
    setDialogOpen(groupID !== null && true)
    setEditMode(true)
    console.log(editingGroupID)
  }
  function handleDialogClose() {
    setDialogOpen(false)
    setEditingGroupID(null)
    setEditMode(false)
  }
  function clearFilter() {
    setfPermissions(undefined)
    setfActive("")
    setfText("")

    axios
    .get(`${process.env.REACT_APP_USERGROUPS_API}`, {
      params: {
        active: "",
        name: "",
        ...(fPermissions ? { permissionCode: fPermissions } : {}),
      },
    })
    .then((res) => setGroupData(res.data))


  }


  return (
    <Grid container>
      <Grid container>
        <form style={{ width: "100%" }}>
          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            style={{ padding: "0.5em 1em" }}
          >
            <Grid item xs={4} alignItems="flex-end">
              <TextField
              fullWidth
                value={fText}
                onChange={(event) => setfText(event.target.value)}
                variant="outlined"
                label="ჯგუფის სახელი"
              ></TextField>
            </Grid>
            <Grid item xs={3}>
              <Autocomplete
                options={comboPermissions}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  value && setfPermissions(value.value)
                }
                renderInput={(params) => (
                  <TextField {...params} label="ნებართვები" />
                )}
              ></Autocomplete>
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                options={comboStatus}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) => value && setfActive(value.value)}
                renderInput={(params) => (
                  <TextField {...params} label="სტატუსი" />
                )}
              ></Autocomplete>
            </Grid>
            <Grid item xs={1}>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
              >
                ძებნა
              </Button>
              
            </Grid>
            <Grid item xs={1}>
                <Button
                  onClick={handleGroupAddOpen}
                  color="primary"
                  variant="contained"
                >
                  <AddIcon  />
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button
                  onClick={clearFilter}
                  color="primary"
                  variant="contained"
                >
                  გაწმენდა
                </Button>
              </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell>
                  <p className="table-header-text">იდენტიფიკაცია</p>
                </TableCell>
                <TableCell>
                  <p className="table-header-text">სახელი</p>
                </TableCell>
                <TableCell>
                  <p className="table-header-text">სტატუსი</p>
                </TableCell>
                <TableCell>
                  <p className="table-header-text">შექმნის თარიღი</p>
                </TableCell>
                <TableCell>
                  <p className="table-header-text">ბოლო რედაქტირების თარიღი</p>
                </TableCell>
                <TableCell>
                  <p className="table-header-text">რედაქტირება</p>
                </TableCell>
                <TableCell>
                  <p className="table-header-text">წაშლა</p>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupData &&
                groupData.groups.map((x) => {
                  return (
                    <TableRow>
                      <TableCell>{x.id}</TableCell>
                      <TableCell>{x.name}</TableCell>
                      <TableCell>
                        {x.active ? (<FiberManualRecordIcon style={{ color: "green" }} />) : (<FiberManualRecordOutlinedIcon color="secondary" />)}
                      </TableCell>
                      <TableCell>{formatDate(x.createTime)}</TableCell>
                      <TableCell>{formatDate(x.lastUpdateTime)}</TableCell>
                      <TableCell>
                        <Button color="primary" variant="contained" onClick = {() => handleGroupEditOpen(x.id)}>
                          <EditIcon />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button color="secondary" variant="contained" onClick = {() => handleDeleteOpen(x.id)}>
                          <DeleteForeverOutlinedIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Dialog open = {dialogOpen} onClose = {() => handleDialogClose()}>
                <EditBox editMode = {editMode} groupID = {editingGroupID} onClose = {handleDialogClose} />
      </Dialog>
      <Dialog open={deleteOpen} onClose = {() => handleDeleteClose()}>
          <DeleteBox groupID = {editingGroupID} onClose = {handleDeleteClose} />
      </Dialog>
    </Grid>
  );
};

export default UserGroups;
