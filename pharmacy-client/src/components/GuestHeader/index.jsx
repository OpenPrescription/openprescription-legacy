import React from "react";
import AppBar from "@material-ui/core/AppBar";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";

import logo from "../../assets/logo.svg";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
}));

export default () => {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleSelectLanguage = (event, lang) => {
    if (!lang) return setAnchorEl(event.currentTarget);
    i18n.changeLanguage(lang);
    setLanguage(lang);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <img src={logo} />
          <Button
            color="inherit"
            aria-controls="language-menu"
            aria-haspopup="true"
            onClick={handleSelectLanguage}
          >
            {language}
            <KeyboardArrowDownIcon />
          </Button>
        </Toolbar>
        <Menu
          id="language-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          keepMounted
        >
          <MenuItem className={classes.menuItemBlock} onClick={(e) => handleSelectLanguage(e, "en")}>
            English
          </MenuItem>
          <MenuItem className={classes.menuItemBlock} onClick={(e) => handleSelectLanguage(e, "pt")}>
            Português
          </MenuItem>
        </Menu>
      </AppBar>
    </header>
  );
};
