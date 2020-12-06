import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import PlayCircle from '@material-ui/icons/PlayCircleFilled';
import React, { PropsWithChildren } from 'react';

const useStyles = makeStyles((theme) => ({
  title: {
    marginRight: 'auto',
  },
}));

const NavBar = ({ children }: PropsWithChildren<any>) => {
  const classes = useStyles();

  return (
    <AppBar color="default">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          RhostMUSH Web Client
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
