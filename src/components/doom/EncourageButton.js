import React, { Component } from "react";
import MyButton from '../../util/MyButton';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// Icons
import FavoriteIcon from "@material-ui/icons/Whatshot";
import FavoriteBorder from "@material-ui/icons/WhatshotOutlined";
// Redux
import { connect } from "react-redux";
import { encourageDoom, discourageDoom } from "../../redux/actions/dataActions";

export class EncourageButton extends Component {
  encouragedDoom = () => {
    if (
      this.props.user.encouragements &&
      this.props.user.encouragements.find(
        (encouragement) => encouragement.doomId === this.props.doomId
      )
    )
      return true;
    else return false;
  };
  encourageDoom = () => {
    this.props.encourageDoom(this.props.doomId);
  };
  discourageDoom = () => {
    this.props.discourageDoom(this.props.doomId);
  };
  render() {
    const { authenticated } = this.props.user;
    const encourageButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Encourage">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.encouragedDoom() ? (
      <MyButton tip="Discourage" onClick={this.discourageDoom}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Encourage" onClick={this.encourageDoom}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );
    return encourageButton;
  }
}

EncourageButton.propTypes = {
  user: PropTypes.object.isRequired,
  doomId: PropTypes.string.isRequired,
  encouragedDoom: PropTypes.func.isRequired,
  discourageDoom: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  encourageDoom,
  discourageDoom,
};

export default connect(mapStateToProps, mapActionsToProps)(EncourageButton);
