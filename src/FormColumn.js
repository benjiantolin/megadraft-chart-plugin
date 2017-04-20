/*
 * Copyright (c) 2016, Globo.com <http://store.backstage.globoi.com/project/jornalismo/chart>
 *
 * License: MIT
 */

import React, {Component} from "react";


export default class FormColumn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      model: this.props.model,
      serieKey: 0
    };

    this.serieKeyInterval = 100;
  }

  _onChange = (e) => {
    let key = e.target.attributes.name.nodeValue;
    let value = e.target.value;
    let column = Object.assign({}, this.props.model, {[key]: value});
    let serieKey = key.split('-');
    let newSeries;
    let newColors;

    if (serieKey[0].indexOf("serieName") === 0) {
      newSeries = this.props.model.data;
      newSeries[parseInt(serieKey[1])][0] = value;
      column = Object.assign({}, this.props.model, {data: newSeries});
    }

    if (serieKey[0].indexOf("seriePoint") === 0) {
      newSeries = this.props.model.data;
      newSeries[parseInt(serieKey[1])][1] = parseFloat(value);
      column = Object.assign({}, this.props.model, {data: newSeries});
    }

    if (serieKey[0].indexOf("color") === 0) {
      newColors = this.props.model.colors;
      newColors[serieKey[1]] = value;
      column = Object.assign({}, this.props.model, {colors: newColors});
    }

    this.props.setStateModal({
      column,
      isFirstEditing: false
    });
  }

  _handlePointColumnAdd = () => {
    let newSeries = this.props.model.data.concat([[null, null]]);
    let column = Object.assign({}, this.props.model, {data: newSeries});
    let serieKey = this.state.serieKey + this.serieKeyInterval;

    this.setState({
      serieKey: serieKey
    });

    this.props.setStateModal({
      column,
      isFirstEditing: false
    });
  }

  _handlePointColumnRemove = (index) => {
    let newSeries = this.props.model.data;
    let serieKey = this.state.serieKey - this.serieKeyInterval;
    let column;

    newSeries.splice(index, 1);
    column = Object.assign({}, this.props.model, {data: newSeries});

    this.setState({
      serieKey: serieKey
    });

    this.props.setStateModal({
      column,
      isFirstEditing: false
    });
  }

  _renderCommonForm = () => {
    let model = this.props.model;

    return (
      <div>
        <div className="bs-ui-form-control group">
          <label className="bs-ui-form-control__label">Título</label>
          <input
            type="text"
            className="bs-ui-form-control__field"
            name="title"
            onChange={this._onChange}
            defaultValue={model.title} />
        </div>
        <div className="bs-ui-form-control group">
          <label className="bs-ui-form-control__label">Subtítulo</label>
          <input
            type="text"
            className="bs-ui-form-control__field"
            name="subtitle"
            onChange={this._onChange}
            defaultValue={model.subtitle} />
        </div>
      </div>
    );
  }

  _renderColumnFormPoints = () => {
    let series = this.props.model.data || [];
    let key = this.state.serieKey;

    return series.map(function(serie, index) {
      key++;
      return (
        <div key={"points-" + this.props.chartID + "-" + key} className="points clear">
          <button
            className="bs-ui-button bs-ui-button--background-red bs-ui-button--small remove-button"
            onClick={() => this._handlePointColumnRemove(index)}>remover</button>
          <input
            key={"color-" + this.props.chartID + "-" + index}
            type="text"
            name={"color-" + index}
            className="bs-ui-form-control__field color-input"
            placeholder="Cor"
            onChange={this._onChange}
            defaultValue={this.state.model.colors[index]} />
          <input
            key={"name-" + this.props.chartID + "-" + index}
            type="text"
            name={"serieName-" + index}
            className="bs-ui-form-control__field points-name"
            placeholder="Legenda"
            onChange={this._onChange}
            defaultValue={serie[0]} />
          <div>
            <input
              key={"point-" + this.props.chartID + "-" + index}
              type="text"
              name={"seriePoint-" + index}
              className="bs-ui-form-control__field point"
              placeholder="Marcador"
              onChange={this._onChange}
              defaultValue={serie[1]} />
          </div>
        </div>
      );
    }, this)
  }

  _renderColumnForm = () => {
    let model = this.props.model;

    return (
      <div className="frame">
        {this._renderCommonForm()}
        <div className="bs-ui-form-control group">
          <label
            className="bs-ui-form-control__label">Legenda Eixo Y</label>
          <input
            type="text"
            className="bs-ui-form-control__field"
            name="yAxisTitle"
            onChange={this._onChange}
            defaultValue={model.yAxisTitle} />
        </div>
        <div className="bs-ui-form-control group">
          <label
            className="bs-ui-form-control__label">Nome da Série</label>
          <input
            type="text"
            className="bs-ui-form-control__field"
            name="name"
            onChange={this._onChange}
            value={model.name} />
        </div>
        <div className="bs-ui-form-control clear group">
          <label
            className="bs-ui-form-control__label">Séries</label>
          {this._renderColumnFormPoints()}
          <div className="new-point clear">
            <button
              className="bs-ui-button bs-ui-button--background-blue bs-ui-button--small"
              onClick={() => this._handlePointColumnAdd()}>nova série</button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this._renderColumnForm();
  }
}
