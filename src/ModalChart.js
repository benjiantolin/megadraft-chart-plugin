/*
 * Copyright (c) 2017, Globo.com <https://github.com/globocom/megadraft-table-plugin>
 *
 * License: MIT
 */

import React, {Component, PropTypes} from "react";

import Modal, {ModalBody, ModalFooter} from "backstage-modal";
import classNames from "classnames";

import Chart from "./Chart";
import FormLine, {lineThemes, line} from "./FormLine";
import FormColumn, {columnThemes, column} from "./FormColumn";
import FormPie, {pieThemes, pie} from "./FormPie";


export default class ModalChart extends Component {

  static propTypes = {
    onCloseRequest: PropTypes.func,
    onSaveRequest: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      isFirstEditing: true,

      lineThemes: lineThemes[sessionStorage.tenantSelectedId || "g1"],
      columnThemes: columnThemes[sessionStorage.tenantSelectedId || "g1"],
      pieThemes: pieThemes[sessionStorage.tenantSelectedId || "g1"],

      line: line,
      column: column,
      pie: pie
    };

    this.model = {
      line: {
        label: "linha",
        themes: [],
        options: {}
      },
      column: {
        label: "barra",
        themes: [],
        options: {}
      },
      pie: {
        label: "pizza",
        themes: [],
        options: {}
      }
    };

    this.chartType = "line";
  }

  _currentComponent = () => {
    let components = {
      line: FormLine,
      column: FormColumn,
      pie: FormPie
    };

    return components[this.chartType];
  }

  _handleChartType = (chartType) => {
    this.chartType = chartType;
    this.setState({
      isFirstEditing: false,
      line: this.model["line"]["options"],
      column: this.model["column"]["options"],
      pie: this.model["pie"]["options"]
    });
  }

  _loadDataBySource() {
    let chart = this.props.chart;

    this.model["line"]["themes"] = this.state.lineThemes;
    this.model["line"]["options"] = this.state.line;
    this.model["column"]["themes"] = this.state.columnThemes;
    this.model["column"]["options"] = this.state.column;
    this.model["pie"]["themes"] = this.state.pieThemes;
    this.model["pie"]["options"] = this.state.pie;

    if (!this.props.isOpen || !this.state.isFirstEditing) return;

    if (this.props.isButton) {
      this.model["line"]["themes"] = lineThemes[sessionStorage.tenantSelectedId || "g1"];
      this.model["line"]["options"] = line;
      this.model["column"]["themes"] = columnThemes[sessionStorage.tenantSelectedId || "g1"];
      this.model["column"]["options"] = column;
      this.model["pie"]["themes"] = pieThemes[sessionStorage.tenantSelectedId || "g1"];
      this.model["pie"]["options"] = pie;
    }

    if (!chart) return;

    this.chartType = chart.type;
    this.model[this.chartType]["themes"] = Object.assign({}, chart.themes);
    this.model[this.chartType]["options"] = Object.assign({}, chart.options);
  }

  _onCloseRequest = () => {
    this.setState({
      isFirstEditing: true
    });
    this.props.onCloseRequest();
  }

  _onSaveRequest = () => {
    let themes = this.model[this.chartType]["themes"];
    let options = this.model[this.chartType]["options"];
    let svgData = this.chartComponent.state.chart.getSVG();
    let canvas = document.createElement("canvas");
    let img = document.createElement("img");
    let width = 800;
    let height = 600;
    let ctx, image;

    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      // window.open(canvas.toDataURL("image/png"));
      image = canvas.toDataURL("image/png");

      this.props.onSaveRequest({
        type: this.chartType,
        themes: themes,
        options: options,
        image: image
      });
    };
  }

  setStateModal = (dict) => {
    this.setState(dict);
  }

  render() {
    let FormComponent;
    let menuClass;

    this._loadDataBySource();

    FormComponent = this._currentComponent();

    menuClass = function(type) {
      return classNames(
        "bs-ui-button", {
          "bs-ui-button--blue": this.chartType === type
        });
    }.bind(this);

    return (
      <Modal className="chart-modal"
             title="Gráfico"
             isOpen={this.props.isOpen}
             onCloseRequest={this._onCloseRequest}
             width="98%"
             height="96%">
        <ModalBody ref="body" >
          <div className="grid">
            <div className="form">
              <div className="frame">
                <div className="menu">
                  {Object.keys(this.model).map(function(type) {
                    return <button
                      key={"button-" + type}
                      className={menuClass(type)}
                      onClick={(chartType) => this._handleChartType(type)}>
                      {this.model[type].label}</button>;
                  }, this)}
                </div>
                <FormComponent
                  key={"form-" + this.chartType + "-" + this.props.chartID}
                  themes={this.model[this.chartType]["themes"]}
                  model={this.model[this.chartType]["options"]}
                  chartID={this.props.chartID}
                  setStateModal={this.setStateModal} />
              </div>
            </div>
            <div className="separator"></div>
            <div className="chart">
              <Chart
                key={"chart-" + this.chartType + "-" + this.props.chartID}
                ref={(chartComponent) => {this.chartComponent = chartComponent;}}
                themes={this.model[this.chartType]["themes"]}
                model={this.model[this.chartType]["options"]}
                connector="highcharts"
                chartType={this.chartType} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="bs-ui-button bs-ui-button--blue bs-ui-button--small"
            onClick={this._onCloseRequest}>fechar</button>
          <button
            className="bs-ui-button bs-ui-button--background-blue bs-ui-button--small"
            onClick={this._onSaveRequest}>aplicar</button>
        </ModalFooter>
      </Modal>
    );
  }
}
