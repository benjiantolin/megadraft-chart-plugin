/*
 * Copyright (c) 2017, Globo.com <http://store.backstage.globoi.com/project/jornalismo/chart>
 *
 * License: MIT
 */

import React, {Component} from "react";

import update from "immutability-helper";

import BaseForm, {Themes} from "./form/baseForm";
import {RadioButtonVertical, RadioButtonHorizontal} from "./form/radioButtons";

export default class FormColumn extends Component {
  constructor(props) {
    super(props);
    this.chartType = "column";
  }

  _changeInverted = (event) => {
    let value = event.target.value;
    this._setStateModal({column: update(this.props.model, {inverted: {$set: (value === "true")} })});
  }

  _setStateModal = (data) => {
    this.props.setStateModal({...data, isFirstEditing: false});
  }

  _renderColumnForm = () => {
    let model = this.props.model;

    return (
      <div>
        <BaseForm
          model={model}
          themes={this.props.themes}
          chartType={this.chartType}
          chartID={this.props.chartID}
          setStateModal={this.props.setStateModal}
        >
          <div className="bs-ui-form-control">
            <label className="bs-ui-form-control__label">Orientação do gráfico</label>
            <label
              className="bs-ui-radio bs-ui-radio--small radio-label-space">
              <RadioButtonVertical
                checked={model.inverted === false}
                onChange={this._changeInverted} />Vertical
            </label>
            <label
              className="bs-ui-radio bs-ui-radio--small radio-label-space">
              <RadioButtonHorizontal
                checked={model.inverted === true}
                onChange={this._changeInverted} />Horizontal
            </label>
          </div>
        </BaseForm>
      </div>
    );
  }

  render() {
    return this._renderColumnForm();
  }
}

export const columnThemes = Object.assign({}, Themes);

export const column = {
  title: "",
  subtitle: "",
  credits: "",
  data: [{
    name: "",
    value: [null]
  }],

  yAxisTitle: "",
  name: "",

  inverted: false
};
