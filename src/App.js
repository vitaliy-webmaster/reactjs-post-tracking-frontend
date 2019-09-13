import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Navigation from "./components/Navigation";
import Ukrpost from "./components/Ukrpost";
import CallbackHandler from "./components/CallbackHandler";
import CallbackFailed from "./components/CallbackFailed";
import CallbackSucceed from "./components/CallbackSucceed";
import LogoutSucceed from "./components/LogoutSucceed";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { fetchUser } from "./actions";

import Registration from "./components/auth/Registration";
import Login from "./components/auth/Login";

class App extends Component {
	componentDidMount() {
		this.props.fetchUser();
	}

	render() {
		return (
			<BrowserRouter basename={process.env.REACT_APP_SUBFOLDER_NAME}>
				<div className="App">
					<Navigation />
					<Switch>
						<Route path="/auth/callback" component={CallbackHandler} />
						<Route path="/auth/callback_failed" component={CallbackFailed} />
						<Route path="/auth/callback_succeed" component={CallbackSucceed} />
						<Route path="/registration" component={Registration} />
						<Route path="/login" component={Login} />
						<Route path="/logout" component={LogoutSucceed} />
						<Route path="/" component={Ukrpost} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default connect(
	null,
	{ fetchUser }
)(App);
