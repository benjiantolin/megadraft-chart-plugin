/*
 * Copyright (c) 2017, Globo.com <httpss://github.com/globocom/megadraft-table-plugin>
 *
 * License: MIT
 */

/* global __ */

import React, {Component} from "react";

import Modal, {ModalBody, ModalFooter} from "backstage-modal";
import Tabs from "backstage-tabs";

import Chart from "./Chart";
import FormLine, {lineInitial} from "./forms/Line";
import FormColumn, {columnInitial} from "./forms/Column";
import FormPie, {pieInitial} from "./forms/Pie";

const FormByChartType = {
  line: FormLine,
  column: FormColumn,
  pie: FormPie
};

const TabsByChartType = [
  {
    value: "line",
    label: __("Line")
  },{
    value: "column",
    label: __("Column")
  },{
    value: "pie",
    label: __("Pie")
  }
];

export default class ModalChart extends Component {
  constructor(props) {
    super(props);

    this.state = this.buildChartState(this.props);

    this.onSaveRequest = ::this.onSaveRequest;
    this.setStateModal = ::this.setStateModal;
  }

  getInitialChartState(props) {
    return {
      chartType: "line",
      line: {
        themes: Object.assign(props.theme),
        options: lineInitial
      },
      column: {
        themes: Object.assign(props.theme),
        options: columnInitial
      },
      pie: {
        themes: Object.assign(props.theme),
        options: pieInitial
      }
    };
  }

  buildChartState(props) {
    let state = this.getInitialChartState(props);

    if (props.chart) {
      state[props.chart.type].options = Object.assign({}, props.chart.options);
      state[props.chart.type].themes = Object.assign({}, props.chart.themes);
      state.chartType = props.chart.type;
    }
    return state;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      let state = this.buildChartState(nextProps);
      this.setState(state);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isOpen || this.props.isOpen || false;
  }

  handleChartType(chartType) {
    this.setState({chartType});
  }

  _encodeOptimizedSVGDataUri(svgString) {
    var uriPayload = encodeURIComponent(svgString.replace(/\n+/g, "")) // remove newlines and encode URL-unsafe characters
      .replace(/%20/g, " ") // put spaces back in
      .replace(/%3D/g, "=") // ditto equals signs
      .replace(/%3A/g, ":") // ditto colons
      .replace(/%2F/g, "/") // ditto slashes
      .replace(/%22/g, "'"); // replace quotes with apostrophes (may break certain SVGs)

    return uriPayload;
  }

  onSaveRequest() {
    let themes = this.state[this.state.chartType].themes;
    let options = this.state[this.state.chartType].options;
    let svgData = this._encodeOptimizedSVGDataUri(this.chartComponent.chart.getSVG());

    this.props.onSaveRequest({
      type: this.state.chartType,
      themes: themes,
      options: options,
      svg: svgData
    });
  }

  setStateModal(data) {
    let newState = {};
    newState[this.state.chartType] = data;
    this.setState(newState);
  }

  render() {
    let currentChartType = this.state.chartType;
    let FormComponent = FormByChartType[currentChartType];
    return (
      <Modal className="chart-modal"
             title={__("Chart")}
             isOpen={this.props.isOpen}
             onCloseRequest={this.props.onCloseRequest}
             width="98%"
             height="96%">
        <ModalBody ref="body">
          <div className="chart-modal__form">
            <Tabs
              tabs={TabsByChartType} activeTab={currentChartType}
              onClickTab={clickedTab => this.handleChartType(clickedTab.value)}
            />
            <FormComponent
              model={this.state[currentChartType]}
              setStateModal={this.setStateModal} />
          </div>
          <div className="chart-modal__chart">
            <Chart
              id="chart-modal__preview"
              ref={(chartComponent) => {this.chartComponent = chartComponent;}}
              theme={this.state[currentChartType].themes}
              data={this.state[currentChartType].options}
              type={currentChartType} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="chart-add-button bs-ui-button bs-ui-button--background-blue bs-ui-button--small"
            onClick={this.onSaveRequest}>{__("apply")}</button>
        </ModalFooter>
      </Modal>
    );
  }
}
