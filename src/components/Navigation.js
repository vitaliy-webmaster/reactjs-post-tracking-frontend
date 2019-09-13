import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { handleLogout } from "../actions";

import Moment from "react-moment";

class Navigation extends Component {
	handleLogoutClick = (event) => {
		event.preventDefault();
		this.props.handleLogout();
	};

	render() {
		let authTools = null;

		if (this.props.auth) {
			authTools = (
				<li className="logout">
					<a href="javascript:void(0)" onClick={this.handleLogoutClick}>
						Вийти з аккаунту
					</a>
				</li>
			);
		} else {
			authTools = (
				<React.Fragment>
					<li className="with-dropdown">
						<Link to="/login">Вхід користувача</Link>
						<ul className="dropdown">
							<div className="dropdown-login-divider"> або</div>
							<li className="google-item">
								<a href={process.env.REACT_APP_SERVER_DOMAIN_NAME + "/auth/google"}>
									Вхід з Google
								</a>
							</li>
							<li className="facebook-item">
								<a href={process.env.REACT_APP_SERVER_DOMAIN_NAME + "/auth/facebook"}>
									Вхід з Facebook
								</a>
							</li>
							<li className="twitter-item">
								<a href={process.env.REACT_APP_SERVER_DOMAIN_NAME + "/auth/twitter"}>
									Вхід з Twitter
								</a>
							</li>
						</ul>
					</li>
					<li className="registration">
						<Link to="/registration">Реєстрація</Link>
					</li>
				</React.Fragment>
			);
		}

		let greetingRight = null;
		let greetingLeft = null;

		if (this.props.auth === null) {
			greetingRight = (
				<div className="user-greeting">Вітаємо, будь-ласка авторизуйтесь!</div>
			);
		} else if (this.props.auth === false) {
			greetingRight = (
				<div className="user-greeting">
					Вітаємо, термін дії попередньої авторизації вичерпано. <br />
					Будь-ласка авторизуйтесь повторно!
				</div>
			);
		} else {
			greetingLeft = (
				<div className="user-greeting user-data">
					<div>
						{this.props.auth.userProfile.favouritesSaveTimestamp ? (
							<React.Fragment>
								<span> Останнє збереження в аккаунті: </span> <br />
								<span>
                  {" "}
									<Moment format="YYYY-MM-DD HH:mm:ss">
                    {parseInt(
											this.props.auth.userProfile.favouritesSaveTimestamp,
											10
										)}
                  </Moment>
                </span>
							</React.Fragment>
						) : null}
					</div>
				</div>
			);

			greetingRight = (
				<div className="user-greeting user-data">
					<div>
						<div> Вітаємо, {this.props.auth.userProfile.name} </div>
						<div> Тип авторизації: {this.props.auth.userProfile.userType} </div>
						<div>
							Електронна адреса:{" "}
							{this.props.auth.userProfile.userType === "local"
								? this.props.auth.userProfile.email
								: this.props.auth.userProfile[
								this.props.auth.userProfile.userType + "Email"
									]}
						</div>
					</div>
				</div>
			);
		}

		return (
			<React.Fragment>
				<div className="top-nav-fw">
					<div className="my-custom-container">
						<nav className="top-nav">
							<ul className="current-section">
								<li className="active">
									<Link to="/ukrpost">Укрпошта</Link>
								</li>
								<li>
									<Link to="/">Нова Пошта</Link>
								</li>
								<li>
									<Link to="/">Міст Експресс</Link>
								</li>
							</ul>
							<ul className="tools">{authTools}</ul>
						</nav>
					</div>
				</div>
				<div className="nav-box-fw">
					<div className="my-custom-container">
						<nav className="navbar navbar-expand-sm navbar-light">
							<Link className="navbar-brand" to="/">
								<span>Сервіс трекінгу поштових відправлень</span>
							</Link>
							<div className="m-auto">{greetingLeft}</div>
							<div className="ml-auto">{greetingRight}</div>
						</nav>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}

export default connect(
	mapStateToProps,
	{ handleLogout }
)(Navigation);
