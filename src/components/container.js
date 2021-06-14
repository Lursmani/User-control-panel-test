import React, { useEffect, useState } from "react";
import Users from "./users";
import UserGroups from "./user-groups";
import { Grid, Container, Menu, MenuItem, Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CloseIcon from "@material-ui/icons/Close";

import "./CSS/container.css";

function TabButton(props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80% 20%",
        justifyItems: "center",
      }}
    >
      <p>{props.label}</p>
      <Button
        style={{ padding: "0", width: "100%" }}
        onClick={() => props.onClick()}
      >
        {" "}
        <CloseIcon style={{ color: "white" }} />{" "}
      </Button>
    </div>
  );
}

const ContainerComponent = () => {
  const [menuArr, setMenuArr] = useState([]);
  const [curTab, setCurTab] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }
  function handleMenuClose() {
    setAnchorEl(null);
  }
  function handleMenuUsers() {
    setAnchorEl(null);
    setMenuArr([...menuArr, { component: <Users />, title: "მომხმარებლები" }]);
  }
  function handleMenuUserGroups() {
    setAnchorEl(null);
    setMenuArr([
      ...menuArr,
      { component: <UserGroups />, title: "მომხმარებელთა ჯგუფი" },
    ]);
  }
  function handleTabChange(event, newValue) {
    setCurTab(newValue);
  }
  function handleTabClose(index, num) {
    menuArr.splice(index, 1);

    // let originalArr = menuArr;
    // if (index === 0) {
    //   originalArr.shift();
    // } else {
    //   originalArr.splice(index, 1);
    // }
    // setMenuArr(originalArr);
  }

  useEffect(() => {
    console.log(menuArr);
  }, [menuArr, curTab]);

  return (
    <Container className="container" maxWidth="false" elevation="5">
      <Grid className="topBar" container>
        <Button
          onClick={handleMenuOpen}
          variant="contained"
          color="primary"
          style={{ margin: "1vh 1vw" }}
          id="menu-button"
        >
          Menu
        </Button>

        <Menu
          id="menu"
          onClose={handleMenuClose}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          keepMounted
        >
          <MenuItem onClick={handleMenuUsers}>მომხმარებლები</MenuItem>
          <MenuItem onClick={handleMenuUserGroups}>
            მომხმარებელთა ჯგუფები
          </MenuItem>
        </Menu>
      </Grid>

      <Grid container>
        <AppBar position="static" style={{ margin: "0", padding: "0" }}>
          <Tabs value={curTab} onChange={handleTabChange}>
            {menuArr.map((comp, index) => {
              return (
                <Tab
                  label={
                    <TabButton
                      label={comp.title}
                      onClick={() => handleTabClose(index, 1)}
                    />
                  }
                ></Tab>
              );
            })}
          </Tabs>
        </AppBar>

        {menuArr.map((comp, index) => {
          return (
            <div
              key={index}
              style={{
                display: index === curTab ? "block" : "none",
                minWidth: "100%",
              }}
            >
              {comp.component}
            </div>
          );
        })}
      </Grid>

      <Grid container id="content"></Grid>
    </Container>
  );
};

export default ContainerComponent;
