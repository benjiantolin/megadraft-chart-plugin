/*
 * Copyright (c) 2017, Globo.com <https://github.com/globocom/megadraft-chart-plugin>
 *
 * License: MIT
 */

import React, {Component} from "react";
import update from "immutability-helper";

import PointsForm from "./Points";
import CommonFieldsGroup from "./commonFields";


export const BaseFormConfig = {
  seriePointRegex: /^\-?(\d+(\.?\d*))?$/
};
// all unit tests for this regex in https://regex101.com/r/9iA7wC/2

export default class BaseForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serieKey: 0
    };
    this.serieKeyInterval = 100;
  }

  updateChartData(newData) {
    this.props.setStateModal(update(this.props.model, {options: newData}));
  }

  _changeSerieName = (event, index) => {
    let value = event.target.value;
    this.updateChartData({data: {[index]: {$merge: {name: value}}}});
  }

  _changeSeriePoint = (event, index, indexPoint=0) => {
    let value = event.target.value;
    if (value.match(BaseFormConfig.seriePointRegex)) {
      this.updateChartData({data: {[index]: {value: {$merge: {[indexPoint]: value}}}}});
    }
  }

  _changeColor = (event, index) => {
    let value = event.target.value;
    let data = update(this.props.model, {themes: {colors: {$merge: {[index]: value} }}});
    this.props.setStateModal(data);
  }

  _changeCommon = (event) => {
    let key = event.target.attributes.name.nodeValue;
    let value = event.target.value;
    this.updateChartData({[key]: {$set: value}});
  }

  _handlePointAdd = (numberOfPointers=1) => {
    let serieKey = this.state.serieKey + this.serieKeyInterval;
    this.setState({serieKey});

    let newItemData = {name: "", value: new Array(parseInt(numberOfPointers)).fill(null)};
    this.updateChartData({data: {$push: [newItemData]}});
  }

  _handlePointRemove = (index) => {
    let newSeries = this.props.model.options.data;
    let serieKey = this.state.serieKey - this.serieKeyInterval;
    let colors = this.props.model.themes.colors.slice();
    let options, themes;

    if (newSeries.length === 1) {
      return;
    }

    newSeries.splice(index, 1);
    options = Object.assign({}, this.props.model.options, {data: newSeries});

    colors = colors.concat(colors.splice(index, 1));
    themes = Object.assign({}, this.props.model.themes, {colors});

    this.setState({serieKey});
    this.props.setStateModal({options, themes});
  }

  render() {
    return (
      <div>
        {CommonFieldsGroup(this.props.fields, this.props.model.options, this._changeCommon)}
        { this.props.children }
        <PointsForm
          series={this.props.model.options.data || []}
          serieKey={this.state.serieKey}
          themes={this.props.model.themes}
          onChangeSerieName={this._changeSerieName}
          onChangeSeriePoint={this._changeSeriePoint}
          onChangeColor={this._changeColor}
          handlePointAdd={() => this._handlePointAdd(this.props.model.options.numberOfMarkers)}
          handlePointRemove={this._handlePointRemove}
        />
      </div>
    );
  }
}

export const commonInitialData = {
  title: "",
  subtitle: "",
  credits: "",
  data: [{
    name: "",
    value: [null]
  }]
};
