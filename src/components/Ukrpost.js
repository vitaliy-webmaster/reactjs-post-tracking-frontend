import React, { Component } from "react";

import {
	// setToLocalStorage,
	getFromLocalStorage
} from "../helpers/localStorageAPI";

import { connect } from "react-redux";
import {
	setFavourites, setCurrentTrackInfo, handleFormChange, saveFavsToCloud, getFavsFromCloud,
	handleFavouritesArrayUpdate, handleAddToFavourites, handleFavRename, deleteItemFromFav
} from "../actions";

import UkrpostTableRow from "./UkrpostTableRow";

class Ukrpost extends Component {

	componentDidMount() {
		const localFavouritesArray = getFromLocalStorage();
		this.props.setFavourites(localFavouritesArray);
	}

	handleFormSubmit = event => {
		event.preventDefault();
		this.props.setCurrentTrackInfo(this.props.data.formField);
	};

	handleChange = event => {
		this.props.handleFormChange(event.target.value);
	};

	handleSaveToCloud = () => {
		if (window.confirm("Зберегти поточний список в аккаунт?")) {
			this.props.saveFavsToCloud(this.props.data.favouritesArray);
		}
	};

	handleGetFromCloud = () => {
		if (
			window.confirm(
				"Завантажити раніше збережену копію списку Обраного з аккаунту?"
			)
		) {
			// console.log("Getting from cloud...");
			this.props.getFavsFromCloud();
		}
	};

	handleAddToFavouritesArray = currentTrack => {
		this.props.handleAddToFavourites(currentTrack);
	};

	handleFavRename = (localDescrText, event, trackcode) => {
		event.preventDefault();
		this.props.handleFavRename(localDescrText, trackcode);
	};

	handleFavDelete = (trackcode) => {
		this.props.deleteItemFromFav(trackcode);
	};

	renderTableRows() {
		return this.props.data.favouritesArray.map(favItem => {
			return (
				<UkrpostTableRow
					key={favItem.trackCode}
					itemData={favItem}
					onFavRename={(localDescrText, event) =>
						this.handleFavRename(localDescrText, event, favItem.trackCode)
					}
					onFavDelete={trackcode => this.handleFavDelete(trackcode)}
				/>
			);
		});
	}

	// saveTracks() {
	// 	setToLocalStorage(this.props.data.favouritesArray);
	// }

	render() {
		return (
			<div className="ukrpost-container">
				<div className="text-center">
					<h2>Трекінг поштових відправлень "Укрпошти"</h2>
				</div>

				<div className="tracking-form-box">
					<form className="tracking-form" onSubmit={this.handleFormSubmit}>
						<input
							className="form-control"
							value={this.props.data.formField}
							onChange={this.handleChange}
							type="text"
							placeholder="CA123456789UA"
							name="trackcode"
						/>
						<button
							className="submit-btn btn waves-effect waves-light"
							type="submit"
						>
							ПОШУК<i className="material-icons right">send</i>
						</button>
						<label>
							<input
								type="checkbox"
								className="lang-checkbox"
								id="lang-checkbox"
							/>
							<span>English</span>
						</label>
					</form>
				</div>

				<div className="arrow-box" />

				<div className="track-result-box">
					<div className="track-result-row">
						<span className="text-bolder">Трек-номер : </span>
						{this.props.data.currentTrack.trackCode ? (
							<span> {this.props.data.currentTrack.trackCode} </span>
						) : null}
					</div>
					<div className="track-result-row">
						<span className="text-bolder">Місцезнаходження : </span>
						{this.props.data.currentTrack.lastEventDescription ? (
							<span> {this.props.data.currentTrack.lastEventDescription} </span>
						) : null}
					</div>
				</div>

				<div className="buttons-box">
					{this.props.data.favouritesArray.length > 0 ? (
						<div className="upd-favourites-button">
							<button
								className="button"
								onClick={() =>
									this.props.handleFavouritesArrayUpdate(
										this.props.data.favouritesArray
									)
								}
							>
								Оновити Обране
							</button>
						</div>
					) : null}

					{this.props.data.favouritesArray.length > 0 ? (
						<div className="save-to-cloud-button">
							<button className="button" onClick={this.handleSaveToCloud}>
								Зберегти в аккаунт
							</button>
						</div>
					) : null}

					{this.props.data.favouritesArray.length >= 0 ? (
						<div className="get-from-cloud-button">
							<button className="button" onClick={this.handleGetFromCloud}>
								Завантажити з аккаунту
							</button>
						</div>
					) : null}

					{this.props.data.currentTrack.lastEventDescription ? (
						<div className="favourites-button">
							<button
								className="button"
								onClick={() =>
									this.handleAddToFavouritesArray(this.props.data.currentTrack)
								}
							>
								Додати до Обраного
							</button>
						</div>
					) : null}
				</div>

				<div className="clearfix" />

				<h3>Обране (зберігається в пам'яті браузера)</h3>

				<table className="favourites-list-table">
					<thead>
					<tr className="text-center">
						<th>Відправлення</th>
						<th>Час ост. перевірки</th>
						<th>Статус доставки</th>
						<th>Видалити</th>
					</tr>
					</thead>
					<tbody>
					{this.renderTableRows()}

					{this.props.data.favouritesArray.length === 0 ? (
						<tr>
							<td></td>
							<td className="no-info" colSpan="2">
								{" "}
								Жодного трек-номеру ще не додано.{" "}
							</td>
							<td></td>
						</tr>
					) : null}
					</tbody>
				</table>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		data: state.data
	};
}

export default connect(
	mapStateToProps,
	{
		setFavourites, setCurrentTrackInfo, handleFormChange, saveFavsToCloud, getFavsFromCloud,
		handleFavouritesArrayUpdate, handleAddToFavourites, handleFavRename, deleteItemFromFav
	}
)(Ukrpost);
