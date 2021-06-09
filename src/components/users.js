import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Paper,  } from "@material-ui/core";
import { Pagination } from "@material-ui/lab"
import axios from "axios";
import {
  Table,
  TableHead,
  TableFooter,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TablePagination,
} from "@material-ui/core";
import "./CSS/users.css"

const classes = makeStyles({
  tableHeader: {
    background: "#d4d6d9",
  },
  
});

const Users = () => {
  const [userData, setUserData] = useState();
  const [page, setPage] = useState(0)
  const styles = classes();
  console.log(page)

  


  function pageCalc() {
    let pages
    if (userData !== undefined) {
    if (userData.totalCount % 10  > 0)  {
      pages = Math.floor((userData.totalCount / 10) + 1)
    } else {pages = userData.totalCount / 10}}
    return pages
  }

  function handlePageChange(event, value) {
      setPage(value - 1)
  }


  useEffect(() => {
    axios
      .get("http://13.51.98.179:8888/users", { params: {limit: 10, page: page} })
      .then((res) => setUserData(res.data))
      .then(console.log(userData));
  }, [page]);

  function formatDate(rawDate) {
    const date = rawDate.match(/.*(?=T)/);
    const time = rawDate.match(/(?<=T).*(?=\.)/);

    return `${date} ${time}`;
  }

  function renderRows() {
    return (
      <TableBody>
        {userData !== undefined &&
          userData.users.map((user) => {
            return (
              <TableRow >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>
                  {user.userGroups.map((x, i) => {
                    return user.userGroups[i + 1] ? `${x.name}, ` : `${x.name}`
                  })}
                </TableCell>
                <TableCell>{formatDate(user.createTime)}</TableCell>
                <TableCell>{formatDate(user.lastUpdateTime)}</TableCell>
                <TableCell>{user.active}</TableCell>
                <TableCell>EDIT</TableCell>
                <TableCell>DELETE</TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    );
  }

  return (
    <Grid>
      <Grid container></Grid>
      <TableContainer component={Paper}>
        <Table style={{ width: "100%" }}>
          <TableHead>
            <TableRow className = {styles.tableHeader}>
              <TableCell><p className = "table-header-text">ID</p></TableCell>
              <TableCell><p className = "table-header-text">მომხმარებლის სახელი</p></TableCell>
              <TableCell><p className = "table-header-text">სრული სახელი</p></TableCell>
              <TableCell><p className = "table-header-text">ჯგუფები</p></TableCell>
              <TableCell><p className = "table-header-text">შექმნის თარიღი</p></TableCell>
              <TableCell><p className = "table-header-text">ბოლო რედაქტირების თარიღი</p></TableCell>
              <TableCell><p className = "table-header-text">სტატუსი</p></TableCell>
              <TableCell><p className = "table-header-text">რედაქტირება</p></TableCell>
              <TableCell><p className = "table-header-text">წაშლა</p></TableCell>
            </TableRow>
          </TableHead>
          {renderRows()}
        </Table>
        
      </TableContainer>
      <Grid container justify = "center" >
        <Pagination shape="rounded" color="primary" count = {pageCalc()} onChange={handlePageChange} style={{padding: "0.5rem 0"}} />
      </Grid>
    </Grid>
  );
};



export default Users;
