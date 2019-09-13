import React, { Component } from "react";
import { Redirect } from "react-router";

class CallbackHandler extends Component {
  state = {
    token: "",
    firstRender: true
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    let token = query.get("token");
    if (token) {
      localStorage.setItem("user-jwt", token);
      this.setState({ token: token, firstRender: false });
    } else {
      localStorage.setItem("user-jwt", "");
      this.setState({ token: "", firstRender: false });
    }
  }

  render() {
    let renderData = "";

    if (!this.state.firstRender) {
      if (this.state.token) {
        renderData = <Redirect to="/auth/callback_succeed" />;
      } else {
        renderData = <Redirect to="/auth/callback_failed" />;
      }
    }

    return <div>{renderData}</div>;
  }
}

export default CallbackHandler;
