import React, { Component } from "react";

class LogoutSucceed extends Component {
	componentDidMount() {
		window.setTimeout(() => {
			window.location.href = process.env.REACT_APP_SUBFOLDER_NAME;
		}, 2000);
	}

	render() {
		return (
			<main>
				<div className="container">
					<div className="row">
						<div className="col-sm-6 offset-sm-3 full-page-message">
							Виконую вихід із аккаунту. <br /> Переадресую на головну
							сторінку..
						</div>
					</div>
				</div>
			</main>
		);
	}
}

export default LogoutSucceed;
