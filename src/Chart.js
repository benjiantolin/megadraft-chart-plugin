/*
 * Copyright (c) 2016, Globo.com <http://store.backstage.globoi.com/project/jornalismo/chart>
 *
 * License: MIT
 */

import React, {Component} from "react";
import Highcharts from 'highcharts/highcharts';

require('highcharts/modules/exporting')(Highcharts);

import {
  CreateBasicLine,
  CreateSimpleColumn,
  CreatePieChart
} from "./HighchartsConnector";


export default class Chart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._renderChart();
  }

  componentDidUpdate() {
    this._renderChart();
  }

  _getConnector() {
    let connector = {
      highcharts: {
        line: {
          create: CreateBasicLine
        },
        column: {
          create: CreateSimpleColumn
        },
        pie: {
          create: CreatePieChart
        }
      }
    };

    return connector[this.props.connector][this.props.chartType];
  }

  _currentCreate = () => {
    return this._getConnector().create;
  }

  _renderChart = () => {
    let model = this.props.model;
    let create = this._currentCreate();
    create('preview', Object.assign({}, model));
  }

  render() {
    return <div id="preview"></div>;
  }
}
