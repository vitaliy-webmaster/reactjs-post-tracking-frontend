import React, { Component } from "react";
import { connect } from "react-redux";
import { handleRegistration } from "../../actions";
import { reduxForm, Field } from "redux-form";
import { Link, withRouter } from "react-router-dom";
import InputField from "./InputField";
import validateEmail from "../../helpers/validateEmail";

class RegistrationForm extends Component {
	renderRegistrationErr() {
		if (this.props.error && this.props.error.localRegistrationErr) {
			return (
				<div className="local-login-errbox">
					<div className="local-login-errmsg">
						{this.props.error.localRegistrationErr.message}
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
					name="registrationEmail"
					component={InputField}
				/>
				<Field
					label="Ваш пароль"
					type="password"
					name="registrationPassword"
					component={InputField}
				/>
				<Field
					label="Повторне введення паролю"
					type="password"
					name="registrationPassword2"
					component={InputField}
				/>
				<Field
					label="Ваше ім'я"
					type="text"
					name="registrationName"
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
						<form noValidate
									className="login-form"
									onSubmit={this.props.handleSubmit((values) =>
										this.props.handleRegistration(
											values.registrationEmail,
											values.registrationPassword,
											values.registrationPassword2,
											values.registrationName,
											this.props.history
										)
									)}
						>
							{this.renderRegistrationErr()}

							{this.renderFields()}

							<Link to="/" className="login-cancel-btn">
								{" "}
								Відмінити{" "}
							</Link>
							<button className="login-submit-btn float-right" type="submit">
								Зареєструватися
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

	if (!validateEmail(values.registrationEmail || "")) {
		errors.registrationEmail = "Невірний формат ел. адреси";
	}

	if (!(values.registrationEmail && values.registrationEmail.trim())) {
		errors.registrationEmail = "Будь-ласка введіть вашу ел. адресу";
	}

	if (values.registrationPassword && values.registrationPassword.length < 6) {
		errors.registrationPassword = "Пароль має складатися з мінімум 6 символів";
	}

	if (!values.registrationPassword) {
		errors.registrationPassword = "Будь-ласка введіть ваш пароль";
	}

	if (values.registrationPassword !== values.registrationPassword2) {
		errors.registrationPassword2 = "Введені паролі не співпадають";
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
	form: "registrationForm",
	destroyOnUnmount: true
})(
	connect(
		mapStateToProps,
		{ handleRegistration }
	)(withRouter(RegistrationForm))
);
