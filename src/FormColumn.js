/*
 * Copyright (c) 2017, Globo.com <http://store.backstage.globoi.com/project/jornalismo/chart>
 *
 * License: MIT
 */

import React from "react";

import update from "immutability-helper";

import BaseForm, {Themes} from "./form/baseForm";
import {RadioButtonVertical, RadioButtonHorizontal} from "./form/radioButtons";

import CommonForm from "./form/commonForm";
import PointsForm from "./form/pointsForm";

export default class FormColumn extends BaseForm {
  constructor(props) {
    super(props);
    this.chartType = "column";
  }

  _changeInverted = (event) => {
    let value = event.target.value;
    this._setStateModal({column: update(this.props.model, {inverted: {$set: (value === "true")} })});
  }

  _renderColumnForm = () => {
    let model = this.props.model;

    return (
      <div>
        <CommonForm
          onChange={this._changeCommon}
          model={model}
        />
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
        <PointsForm
          series={this.props.model.data || []}
          serieKey={this.state.serieKey}
          chartID={this.props.chartID}
          themes={this.props.themes}
          onChangeSerieName={this._changeSerieName}
          onChangeSeriePoint={this._changeSeriePoint}
          onChangeColor={this._changeColor}
          handlePointAdd={() => this._handlePointAdd(this.props.model.numberOfMarkers)}
          handlePointRemove={this._handlePointRemove}
        />
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
