import React, { Component } from 'react';

class InputField extends Component {
  render() {
    return (
      <div className="input-field">
        <label>{this.props.label}</label>
        <input {...this.props.input} type={this.props.type} />
        <div className="input-field-error">
          {this.props.meta.touched && this.props.meta.error}
        </div>
      </div>
    );
  }
}

export default InputField;
