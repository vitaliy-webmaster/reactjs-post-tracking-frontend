import React, { Component } from "react";
import { connect } from "react-redux";
import { resetErrorsState, handleLogin } from "../../actions";
import { reduxForm, Field } from "redux-form";
import { Link, withRouter } from "react-router-dom";
import InputField from "./InputField";
import validateEmail from "../../helpers/validateEmail";

class LoginForm extends Component {
	constructor(props) {
		super(props);
		// Resetting errors state before mounting component
		this.props.resetErrorsState();
	}

	renderMessageFromReg() {
		const message = this.props.history.location.state;
		if (!(this.props.error && this.props.error.localLoginErr)) {
			if (message) {
				return (
					<div className="local-login-errbox">
						<div className="local-login-errmsg">{message.messageFromReg}</div>
					</div>
				);
			}
		}
	}

	renderLoginErr() {
		if (this.props.error && this.props.error.localLoginErr) {
			return (
				<div className="local-login-errbox">
					<div className="local-login-errmsg">
						{this.props.error.localLoginErr.message}
					</div>
				</div>
			);
		}
	}

	renderFields() {
		return (
			<div>
				<Field
					label="Ваша електронна адреса"
					type="text"
					name="loginEmail"
					component={InputField}
				/>
				<Field
					label="Ваш пароль"
					type="password"
					name="loginPassword"
					component={InputField}
				/>
			</div>
		);
	}

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-sm-12">
						<form
							className="login-form"
							onSubmit={this.props.handleSubmit((values) =>
								this.props.handleLogin(
									values.loginEmail,
									values.loginPassword,
									this.props.history
								)
							)}
						>
							{this.renderLoginErr()}
							{this.renderMessageFromReg()}
							{this.renderFields()}

							<Link to="/" className="login-cancel-btn">
								{" "}
								Відмінити{" "}
							</Link>
							<button className="login-submit-btn float-right" type="submit">
								Увійти
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

function validate(values) {
	const errors = {};

	if (!validateEmail(values.loginEmail || "")) {
		errors.loginEmail = "Невірний формат ел. адреси";
	}

	if (!(values.loginEmail && values.loginEmail.trim())) {
		errors.loginEmail = "Будь-ласка введіть вашу ел. адресу";
	}

	if (!values.loginPassword) {
		errors.loginPassword = "Будь-ласка введіть ваш пароль";
	}

	return errors;
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		error: state.error
	};
}

export default reduxForm({
	validate: validate,
	form: "loginForm",
	destroyOnUnmount: true
})(
	connect(
		mapStateToProps,
		{ resetErrorsState, handleLogin }
	)(withRouter(LoginForm))
);
