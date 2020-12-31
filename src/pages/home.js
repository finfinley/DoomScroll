import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from 'prop-types';

import Doom from '../components/doom/Doom';
import Profile from '../components/profile/Profile';
import DoomSkeleton from '../util/DoomSkeleton';

import { connect } from 'react-redux';
import { getDooms } from '../redux/actions/dataActions'
export class home extends Component {
  componentDidMount() {
    this.props.getDooms();
  }
  render() {
    const { impendingdooms, loading } = this.props.data;
    let recentDoomMarkup = !loading ? (
      impendingdooms.map((doom) => <Doom key={doom.doomId} doom={doom}/>)
    ) : (
      <DoomSkeleton />
    )
    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentDoomMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile/>
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getDooms: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  data: state.data
})

export default connect(mapStateToProps, { getDooms })(home);
