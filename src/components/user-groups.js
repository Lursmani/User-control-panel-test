import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Paper, TextField, Button } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from "@material-ui/core";
import "./CSS/users.css";
import { Autocomplete } from "@material-ui/lab";

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
    {name: "ყველა", value: undefined},
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
    let permissions = fPermissions && fPermissions;

    axios
      .get("http://13.51.98.179:8888/userGroups", {
        params: {
          active: fActive,
          name: fText,
          ...(fPermissions ? { permissionCode: fPermissions } : {}),
        },
      })
      .then((res) => setGroupData(res.data))
      .then(console.log(groupData));
  }

  const test = {
    active: fActive,
    name: fText,
    ...(fPermissions ? { permission: fPermissions } : {}),
  }
  useEffect(() => {
    console.log(fActive);
    console.log(fText);
    console.log(fPermissions);
    console.log(test)
  }, [fActive, fText, fPermissions]);

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
            <Grid item xs={2} alignItems="flex-end">
              <TextField
                value={fText}
                onChange={(event) => setfText(event.target.value)}
                variant="outlined"
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
            <Grid item xs={2}>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
              >
                ძებნა
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
                      <TableCell>{x.active}</TableCell>
                      <TableCell>{formatDate(x.createTime)}</TableCell>
                      <TableCell>{formatDate(x.lastUpdateTime)}</TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default UserGroups;
