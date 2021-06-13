import React, { useEffect, useState } from "react";
import AddBox from "./addBox"
import Grid from "@material-ui/core/Grid";
import { makeStyles, Paper, TextField, Button, Dialog } from "@material-ui/core";
import { Autocomplete, Pagination } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  AppBar,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit"
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord"
import FiberManualRecordOutlinedIcon from "@material-ui/icons/FiberManualRecordOutlined"
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import "./CSS/users.css";

const classes = makeStyles({
  tableHeader: {
    background: "#d4d6d9",
  },
});

const Users = () => {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [userData, setUserData] = useState();
  const [filter, setFilter] = useState({
    userName: "",
    fullName: "",
    email: "",
    userGroup: "",
    active: "",
  });
  const [userGroupData, setUserGroupData] = useState([]);
  const [dataReceived, setDataReceived] = useState(false);

  // MODAL STATE
  const [editingUser, setEditingUser] = useState(null)
  const [manageOpen, setManageOpen] = useState(false)

  const styles = classes();

  function pageCalc() {
    let pages;
    if (userData !== undefined) {
      if (userData.totalCount % 10 > 0) {
        pages = Math.floor(userData.totalCount / 10 + 1);
      } else {
        pages = userData.totalCount / 10;
      }
    }
    return pages;
  }
  const groupCombo = {};
  const comboStatus = [
    { name: "აქტიური", value: true },
    { name: "არააქტიური", value: false },
    { name: "აქტიური/არააქტიური", value: "" },
  ];

  function handleDelete(user) {
    setDeleteOpen(true)
    setEditingUser(user)
  }
  function handleDeleteClose() {
    setEditingUser(null)
    setDeleteOpen(false)
  }

  useEffect(() => {
    axios
      .get("http://13.51.98.179:8888/userGroups/forSelection")
      //  .then(res => console.log(res.data.map(x => x.name)))
      .then((res) => setUserGroupData(res.data.map((x) => x)))
      .then(console.log(userGroupData))
  }, []);

  useEffect(() => {
    console.log(filter);
    console.log(userGroupData);
  }, [filter, userGroupData]);

  function formatDate(rawDate) {
    const date = rawDate.match(/.*(?=T)/);
    const time = rawDate.match(/(?<=T).*(?=\.)/);

    return `${date} ${time}`;
  }

  function getData() {
    const searchParams = {
      limit: 10,
      page: 0,
      fullName: filter.fullName,
      email: filter.email,
      username: filter.userName,
      userGroup: filter.userGroup,
      active: filter.active,
    };
    console.log(searchParams);

    axios
      .get("http://13.51.98.179:8888/users", {
        params: {
          limit: 10,
          fullName: filter.fullName,
          email: filter.email,
          userGroup: filter.userGroup,
          active: filter.active,
          ...(filter.userName === "" ? {} : { username: filter.userName }),
        },
      })
      .then((res) => setUserData(res.data))
      .then(setDataReceived(true));
  }

  function handlePageChange(event, value) {
    let curPage = value - 1;
    axios
      .get("http://13.51.98.179:8888/users", {
        params: {
          limit: 10,
          page: curPage,
          fullName: filter.fullName,
          email: filter.email,
          groupId: filter.userGroup,
          active: filter.active,
          ...(filter.username === "" ? {} : { username: filter.username }),
        },
      })
      .then((res) => setUserData(res.data))
      .then(setDataReceived(true));
  }





  function handleManageOpen() {
    setManageOpen(true)
  }
  function handleManageClose() {
    setManageOpen(false)
    setEditingUser(null)
    // setEditMode(false)
  }
  function handleEditOpen(user) {
    setEditingUser(user)
    // setEditMode(true)
    setManageOpen(true)
  }

  function activeIcon(active) {
    if (!active) {
      return <FiberManualRecordOutlinedIcon color = "secondary" />
    } else {
      return <FiberManualRecordIcon style={{color: "green"}} />
    }
  }








  function renderRows() {
    return (
      <TableBody>
        {userData !== undefined &&
          userData.users.map((user) => {
            return (
              <TableRow>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>
                  {user.userGroups.map((x, i) => {
                    return user.userGroups[i + 1] ? `${x.name}, ` : `${x.name}`;
                  })}
                </TableCell>
                <TableCell>{formatDate(user.createTime)}</TableCell>
                <TableCell>{formatDate(user.lastUpdateTime)}</TableCell>
                <TableCell>{activeIcon(user.active)}</TableCell>
                <TableCell>
                  <Button color="primary" variant = "contained" onClick={() => handleEditOpen(user.id)}>
                    <EditIcon  />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button color="primary" variant = "contained" onClick={() => handleDelete(user.id)}>
                    <DeleteForeverOutlinedIcon />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    );
  }

  return (
    <Grid>
      <Grid container></Grid>
      <Grid container>
        <form style={{ width: "100%" }}>
          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            style={{ padding: "0.5em 1em" }}
          >
            <Grid item xs={2}>
              <TextField
                variant="outlined"
                onChange={(e) =>
                  setFilter({ ...filter, userName: e.target.value })
                }
                value={filter.userName}
                label="სახელი"
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                variant="outlined"
                onChange={(e) =>
                  setFilter({ ...filter, fullName: e.target.value })
                }
                value={filter.fullName}
                label="მომხამრებლის სახელი"
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                variant="outlined"
                onChange={(e) =>
                  setFilter({ ...filter, email: e.target.value })
                }
                value={filter.email}
                label="ელ. ფოსტა"
              />
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                options={userGroupData}
                getOptionLabel={((option) => option.name)}
                onChange={(event, value) =>
                  value && setFilter({ ...filter, userGroup: value.id })
                }
                renderInput={(params) => (
                  <TextField {...params} label="ჯგუფი" />
                )}
              ></Autocomplete>
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                options={comboStatus}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  value && setFilter({ ...filter, active: value.value })
                }
                renderInput={(params) => (
                  <TextField {...params} label="სტატუსი" />
                )}
              ></Autocomplete>
            </Grid>
            <Grid item xs={1}>
              <Button onClick={getData} variant="contained" color="primary">
                ძებნა
              </Button>
             
            </Grid>
            <Grid item xs={1}>
              <Button variant="contained" color="primary" onClick={handleManageOpen}>
                <AddIcon />
              </Button>
              <Dialog open={manageOpen} onClose={handleManageClose} >
                  <AddBox userID = {editingUser} editMode = {editingUser === null ? false : true} />
                </Dialog>
                <Dialog open={deleteOpen} onClose={handleDeleteClose}>
              <DeleteBox  onClose={handleDeleteClose} userID = {editingUser} />
            </Dialog>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <TableContainer component={Paper}>
        <Table style={{ width: "100%" }}>
          <TableHead>
            <TableRow className={styles.tableHeader}>
              <TableCell>
                <p className="table-header-text">ID</p>
              </TableCell>
              <TableCell>
                <p className="table-header-text">მომხმარებლის სახელი</p>
              </TableCell>
              <TableCell>
                <p className="table-header-text">სრული სახელი</p>
              </TableCell>
              <TableCell>
                <p className="table-header-text">ჯგუფები</p>
              </TableCell>
              <TableCell>
                <p className="table-header-text">შექმნის თარიღი</p>
              </TableCell>
              <TableCell>
                <p className="table-header-text">ბოლო რედაქტირების თარიღი</p>
              </TableCell>
              <TableCell>
                <p className="table-header-text">სტატუსი</p>
              </TableCell>
              <TableCell>
                <p className="table-header-text"></p>
              </TableCell>
              <TableCell>
                <p className="table-header-text"></p>
              </TableCell>
            </TableRow>
          </TableHead>
          {renderRows()}
        </Table>
      </TableContainer>
      <Grid container justify="center">
        {dataReceived && (<Pagination
          shape="rounded"
          color="primary"
          count={pageCalc()}
          onChange={handlePageChange}
          style={{ padding: "0.5rem 0" }}
        />)}
      </Grid>
    </Grid>
  );
};



const DeleteBox = (props) => {

  function deleteUser(user) {
      axios.delete(`http://13.51.98.179:8888/users/${user}`)
      props.onClose()
  }

  return (
    <Grid container>
      <AppBar position="static" style={{ margin: "0", padding: "0" }} color="secondary">
        <h3 style={{padding: "0.5em 2em"}}>დადასტურება</h3>
      </AppBar>
      <Grid container>
        <p style={{padding: "1em 2em"}}>დარწმუნებული ხართ, რომ გსურთ მომხმარებლის წაშლა?</p>
      </Grid>
      <Grid container justify="space-around" style={{padding: "1em"}}>
        <Button  onClick={() => deleteUser(props.userID)} variant="contained" color="secondary">დიახ</Button>
        <Button onClick={() => props.onClose()} variant="contained" color="primary">არა</Button>
      </Grid>
    </Grid>
  );
};


export default Users;
