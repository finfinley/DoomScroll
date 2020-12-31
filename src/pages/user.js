import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Doom from "../components/doom/Doom";
import StaticProfile from "../components/profile/StaticProfile";
import DoomSkeleton from '../util/DoomSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';
// MUI Things
import Grid from "@material-ui/core/Grid";
// Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

class user extends Component {
  state = {
    profile: null,
    doomId: null
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    const doomId = this.props.match.params.doomId;

    if(doomId) this.setState({ doomIdParam: doomId })

    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user,
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { impendingdooms, loading } = this.props.data;
    const { doomIdParam } = this.state
    const doomsMarkup = loading ? (
      <DoomSkeleton />
    ) : impendingdooms === null ? (
      <p>This user hasn't posted any doom</p>
    ) : !doomIdParam ? (
      impendingdooms.map((doom) => <Doom key={doom.doomId} doom={doom} />)
    ) : (
        impendingdooms.map(doom => {
            if(doom.doomId !== doomIdParam)
                return <Doom key={doom.doomId} doom={doom} />
            else return <Doom key={doom.doomId} doom={doom} openDialog/>
        })
    )
    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {doomsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});
export default connect(mapStateToProps, { getUserData })(user);
