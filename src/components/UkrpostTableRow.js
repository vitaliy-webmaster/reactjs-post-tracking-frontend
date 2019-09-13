import React, { Component } from "react";
import Moment from "react-moment";

class UkrpostTableRow extends Component {
  state = {
    localDescrText: ""
  };

  handleLocalDescrChange = event => {
    this.setState({
      localDescrText: event.target.value
    });
  };

  render() {
    return (
      <tr className="favourite-item-row">
        <td className="favitem-title-td">
          <div className="fav-title">{this.props.itemData.trackCode}</div>
          <div className="fav-description">
            {" "}
            Ім'я:
            {this.props.itemData.descrText ? (
              <span>{this.props.itemData.descrText}</span>
            ) : null}
          </div>
          <div className="fav-addedtime">
            {" "}
            Додано:
            {this.props.itemData.addedToFavTimestamp ? (
              <span>
                <Moment format="YYYY-MM-DD HH:mm:ss">
                  {parseInt(this.props.itemData.addedToFavTimestamp, 10)}
                </Moment>
              </span>
            ) : null}
          </div>
          <form
            onSubmit={event => {
              this.props.onFavRename(this.state.localDescrText, event);
              this.setState({
                localDescrText: ""
              });
            }}
          >
            <input
              type="text"
              className="favitem-rename-text"
              placeholder="Введіть назву"
              name="fav-rename"
              onChange={this.handleLocalDescrChange}
              value={this.state.localDescrText}
            />
            <button
              type="submit"
              className="favitem-rename-submit button"
              value="OK"
            >
              <i className="material-icons right">send</i>
            </button>
          </form>
        </td>
        <td className="favitem-checktime-td">
          {this.props.itemData.lastCheckTimestamp ? (
            <span>
              <Moment format="YYYY-MM-DD HH:mm:ss">
                {parseInt(this.props.itemData.lastCheckTimestamp, 10)}
              </Moment>
              <br />
              <span className="favitem-checktime-hint">
                ({" "}
                <Moment fromNow>
                  {parseInt(this.props.itemData.lastCheckTimestamp, 10)}
                </Moment>{" "}
                )
              </span>
            </span>
          ) : null}
        </td>
        <td className="favitem-description-td">
          {this.props.itemData.lastEventDescription ? (
            <span>{this.props.itemData.lastEventDescription}</span>
          ) : null}
        </td>
        <td className="favitem-delete-td">
          <button
            className="favitem-delete-button button"
            onClick={() =>
              this.props.onFavDelete(this.props.itemData.trackCode)
            }
          >
            {" "}
            Видалити{" "}
          </button>
        </td>
      </tr>
    );
  }
}

export default UkrpostTableRow;
