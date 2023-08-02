import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      <Box sx={{width:"25%"}}>
        {children}
      </Box>
      {localStorage.getItem("username") !== null && (
        <Stack spacing={1} direction="row" justifyContent="flex-end" alignItems="center">
          <Avatar src="avatar.png" alt={localStorage.getItem("username")}/>
          <Box>{localStorage.getItem("username")}</Box>
          <Button
            className="explore-button"
            onClick={() => {
              localStorage.clear();
              window.location.reload()
            }}
          >LOGOUT
          </Button>
        </Stack>
      )}
      {hasHiddenAuthButtons === true && (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      )}
      {hasHiddenAuthButtons !== true&&localStorage.getItem("username") === null && (
        <Stack direction="row" justifyContent="flex-end">
          <Button
            className="explore-button"
            variant="text"
            onClick={() => {
              history.push("/login");
            }}
          >
            LOGIN
          </Button>
          <Button
            className="button"
            variant="contained"
            onClick={() => {
              history.push("/register");
            }}
          >
            REGISTER
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
