import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
// MUI Things
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from '@material-ui/core/IconButton';
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
// Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";
// Redux
import { connect } from "react-redux";
import { markDoomticksRead } from "../../redux/actions/userActions";

class Doomticks extends Component {
  state = {
    anchorEl: null,
  };
  handleOpen = (event) => {
    this.setState({ anchorEl: event.target });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  onMenuOpened = () => {
    let unreadDoomticksIds = this.props.doomticks
      .filter((not) => !not.read)
      .map((not) => not.doomtickId);
    this.props.markDoomticksRead(unreadDoomticksIds);
  };
  render() {
    const doomticks = this.props.doomticks;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let doomticksIcon;
    if (doomticks && doomticks.length > 0) {
      doomticks.filter((not) => not.read === false).length > 0
        ? (doomticksIcon = (
            <Badge
              badgeContent={doomticks.filter((not) => not.read === false).length}
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          ))
        : (doomticksIcon = <NotificationsIcon />);
    } else {
      doomticksIcon = <NotificationsIcon />;
    }
    let doomticksMarkup =
      doomticks && doomticks.length > 0 ? (
        doomticks.map((not) => {
          const verb =
            not.type === "encouragement" ? "encouraged" : "commented on";
          const time = dayjs(not.createdAt).fromNow();
          const iconColor = not.read ? "primary" : "secondary";
          const icon =
            not.type === "encouragement" ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );

          return (
            <MenuItem key={not.createdAt} onClick={this.handleClose}>
              {icon}
              <Typography
                component={Link}
                color="default"
                variant="body1"
                to={`/user/${not.recipient}/doom/${not.doomId}`}
              >
                {not.sender} {verb} your doom {time}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no doomticks yet
        </MenuItem>
      );
    return (
      <Fragment>
        <Tooltip title="Doomticks">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {doomticksIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {doomticksMarkup}
        </Menu>
      </Fragment>
    );
  }
}

Doomticks.propTypes = {
  markDoomticksRead: PropTypes.func.isRequired,
  doomticks: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  doomticks: state.user.doomticks,
});

export default connect(mapStateToProps, { markDoomticksRead })(Doomticks);
