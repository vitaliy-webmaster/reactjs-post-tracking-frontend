import axios from "axios";
import { setToLocalStorage } from "../helpers/localStorageAPI";
import {
	FETCH_USER,
	SET_FAVOURITES,
	SET_LOCAL_LOGIN_ERROR,
	SET_LOCAL_REGISTRATION_ERROR,
	SET_CURRENT_TRACK_INFO,
	HANDLE_FORM_CHANGE,
	UPDATE_FAVOURITES_ARRAY,
	UPDATE_FAVOURITES_SAVED_TIMESTAMP,
	HANDLE_ADD_TO_FAVOURITES,
	RESET_ERRORS_STATE
} from "./types";

export const resetErrorsState = () => {
	return {
		type: RESET_ERRORS_STATE,
		payload: ""
	};
};

export const handleLogin = (loginEmail, loginPassword, history) => {
	return (dispatch) => {
		const payload = { email: loginEmail, password: loginPassword };

		axios
			.post(process.env.REACT_APP_SERVER_DOMAIN_NAME + "/auth/login", payload)
			.then((response) => {
				const token = response.data.token;

				if (token) {
					localStorage.setItem("user-jwt", token);
					history.push("/auth/callback_succeed");
				} else {
					localStorage.setItem("user-jwt", "");
					history.push("/auth/callback_failed");
				}
			})
			.catch((error) => {
				const errData = error.response.data;

				if (errData.status === "login-error") {
					dispatch({ type: SET_LOCAL_LOGIN_ERROR, payload: errData });
				}
			});
	};
};

export const handleRegistration = (
	registrationEmail,
	registrationPassword,
	registrationPassword2,
	registrationName,
	history
) => {
	return (dispatch) => {
		const payload = {
			email: registrationEmail,
			password: registrationPassword,
			password2: registrationPassword2,
			name: registrationName
		};

		axios
			.post(process.env.REACT_APP_SERVER_DOMAIN_NAME + "/auth/register", payload)
			.then((response) => {
				const responseMessage = response.data;

				if (
					responseMessage &&
					responseMessage.status === "registration-success"
				) {
					dispatch(resetErrorsState());
					history.push("/login", {
						messageFromReg:
							"Реєстрація виконана успішно, тепер ви можете авторизуватись"
					});
				}
			})
			.catch((error) => {
				const errData = error.response.data;

				if (errData.status === "registration-error") {
					dispatch({ type: SET_LOCAL_REGISTRATION_ERROR, payload: errData });
				}
			});
	};
};

export const fetchUser = () => {
	return async (dispatch) => {
		const token = localStorage.getItem("user-jwt");

		if (token) {
			const config = {
				headers: { Authorization: "Bearer " + token }
			};

			const response = await axios.get(
				process.env.REACT_APP_SERVER_DOMAIN_NAME + "/user/profile",
				config
			);
			dispatch({ type: FETCH_USER, payload: response.data });
		} else {
			dispatch({ type: FETCH_USER, payload: null });
		}
	};
};

export const handleLogout = () => {
	localStorage.removeItem("user-jwt");
	return { type: FETCH_USER, payload: null };
};

export const setFavourites = (favArray) => {
	return (dispatch, getState) => {
		dispatch({
			type: SET_FAVOURITES,
			payload: favArray
		});

		return delay(2000).then(() => {
			setToLocalStorage(getState().data.favouritesArray);
		});
	};
};

export const setCurrentTrackInfo = (trackCode) => {
	return async (dispatch) => {
		if (trackCode.length > 6) {
			const queryObj =
				"guid=fcc8d9e1-b6f9-438f-9ac8-b67ab44391dd&barcode=" +
				trackCode +
				"&culture=uk";

			const response = await axios.post(
				"https://reactjs.datasoft.com.ua/post-tracking-app/getTrackInfo.php",
				queryObj
			);

			dispatch({ type: SET_CURRENT_TRACK_INFO, payload: response.data });
		} else {
			window.alert("Введено некоректний трек-номер!");
		}
	};
};

export const handleFormChange = (value) => {
	return {
		type: HANDLE_FORM_CHANGE,
		payload: value
	};
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleFavouritesArrayUpdate = (favArray) => {
	return (dispatch, getState) => {
		const tempFavArray = favArray.map((item) => ({
			...item
		}));
		tempFavArray.forEach((tempFavArrayItem) => {
			const queryObj =
				"guid=fcc8d9e1-b6f9-438f-9ac8-b67ab44391dd&barcode=" +
				tempFavArrayItem.trackCode +
				"&culture=uk";

			axios
				.post(
					"https://reactjs.datasoft.com.ua/post-tracking-app/getTrackInfo.php",
					queryObj
				)
				.then(({ data }) => {
					// tempFavArrayItem.trackCode = data.barcode;
					tempFavArrayItem.lastCheckTimestamp = Date.now();
					tempFavArrayItem.lastEventDate = data.eventdate;
					tempFavArrayItem.lastEventDescription = data.eventdescription;

					dispatch({
						type: UPDATE_FAVOURITES_ARRAY,
						payload: [...tempFavArray]
					});

					return delay(2000).then(() => {
						setToLocalStorage(getState().data.favouritesArray);
					});
				});
		});
	};
};

export const saveFavsToCloud = (favArray) => {
	return (dispatch, getState) => {
		const token = localStorage.getItem("user-jwt");
		const saveTimestamp = Date.now();

		if (token) {
			const data = {
				favList: favArray,
				favouritesSaveTimestamp: saveTimestamp
			};

			const config = {
				headers: { Authorization: "Bearer " + token }
			};

			axios
				.post(
					process.env.REACT_APP_SERVER_DOMAIN_NAME + "/user/save_favourites_list",
					data,
					config
				)
				.then(({ data }) => {
					if (data.type === "success") {
						dispatch({
							type: UPDATE_FAVOURITES_SAVED_TIMESTAMP,
							payload: saveTimestamp
						});
					} else {
						window.alert("Помилка збереження Обраного в аккаунт!");
					}
				})
				.catch((err) => {
					if (err.response.status === 401) {
						window.alert(
							"Для виконання даної операції необхідно авторизуватись!"
						);
					}
				});
		} else {
			window.alert("Для виконання даної операції необхідно авторизуватись!");
		}
	};
};

export const handleAddToFavourites = (currentTrack) => {
	return (dispatch, getState) => {
		if (currentTrack.lastEventDescription) {
			if (
				getState().data.favouritesArray.findIndex(
					(favArrayItem) => favArrayItem.trackCode === currentTrack.trackCode
				) === -1
			) {
				const payload = {
					currentTrack: currentTrack,
					favouritesArray: getState().data.favouritesArray
				};

				dispatch({
					type: HANDLE_ADD_TO_FAVOURITES,
					payload: payload
				});

				return delay(2000).then(() => {
					setToLocalStorage(getState().data.favouritesArray);
				});
			} else {
				window.alert("Поточний трек вже було додано до списку Обраного!");
			}
		}
	};
};

export const handleFavRename = (localDescrText, trackcode) => {
	return (dispatch, getState) => {
		const tempFavArray = getState().data.favouritesArray.slice();
		const renamedItemIndex = tempFavArray.findIndex(
			(favArrayItem) => favArrayItem.trackCode === trackcode
		);
		if (renamedItemIndex !== -1) {
			const renamedItem = tempFavArray[renamedItemIndex];
			tempFavArray.splice(renamedItemIndex, 1, {
				...renamedItem,
				descrText: localDescrText
			});
		}
		dispatch({
			type: SET_FAVOURITES,
			payload: tempFavArray
		});

		return delay(2000).then(() => {
			setToLocalStorage(getState().data.favouritesArray);
		});
	};
};

export const getFavsFromCloud = () => {
	return (dispatch, getState) => {
		const token = localStorage.getItem("user-jwt");

		if (token) {
			const config = {
				headers: { Authorization: "Bearer " + token }
			};

			axios
				.get(
					process.env.REACT_APP_SERVER_DOMAIN_NAME + "/user/get_favourites_list",
					config
				)
				.then(({ data }) => {
					if (data.type === "success") {
						dispatch({
							type: SET_FAVOURITES,
							payload: data.favList
						});
						return delay(2000).then(() => {
							setToLocalStorage(getState().data.favouritesArray);
						});
					} else {
						window.alert("Помилка збереження Обраного в аккаунт!");
					}
				})
				.catch((err) => {
					if (err.response.status === 401) {
						window.alert(
							"Для виконання даної операції необхідно авторизуватись!"
						);
					}
				});
		} else {
			window.alert("Для виконання даної операції необхідно авторизуватись!");
		}
	};
};

export const deleteItemFromFav = (trackCode) => {
	return (dispatch, getState) => {
		const tempFavArray = getState().data.favouritesArray.slice();
		const deleteIndex = tempFavArray.findIndex(
			(favArrayItem) => favArrayItem.trackCode === trackCode
		);
		if (deleteIndex !== -1) {
			tempFavArray.splice(deleteIndex, 1);
			dispatch({
				type: SET_FAVOURITES,
				payload: tempFavArray
			});

			return delay(2000).then(() => {
				setToLocalStorage(getState().data.favouritesArray);
			});
		}
	};
};
