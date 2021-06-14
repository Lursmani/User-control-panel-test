import React from "react"
import {Grid, Button, AppBar} from "@material-ui/core"
import axios from 'axios'


const DeleteBox = (props) => {

    function deleteUser(groupID) {
        axios.delete(`${process.env.REACT_APP_USERGROUPS_API}/${groupID}`)
        props.onClose()
    }
  
    return (
      <Grid container>
        <AppBar position="static" style={{ margin: "0", padding: "0" }} color="secondary">
          <h3 style={{padding: "0.5em 2em"}}>დადასტურება</h3>
        </AppBar>
        <Grid container>
          <p style={{padding: "1em 2em"}}>დარწმუნებული ხართ, რომ გსურთ ჯგუფის წაშლა?</p>
        </Grid>
        <Grid container justify="space-around" style={{padding: "1em"}}>
          <Button  onClick={() => deleteUser(props.groupID)} variant="contained" color="secondary">დიახ</Button>
          <Button onClick={() => props.onClose()} variant="contained" color="primary">არა</Button>
        </Grid>
      </Grid>
    );
  };

  export default DeleteBox