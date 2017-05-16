/*
 * Copyright (c) 2017, Globo.com <http://store.backstage.globoi.com/project/jornalismo/chart>
 *
 * License: MIT
 */

import React, {Component} from "react";
import update from "immutability-helper";
import { PlusIcon, CloseIcon } from "./icon";


export default class FormPie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serieKey: 0
    };

    this.serieKeyInterval = 100;
  }

  _getKeyValue = (event) => {
    let key = event.target.attributes.name.nodeValue;
    let serieKey = key.split("-");
    return {key: key, value: event.target.value, index: parseInt(serieKey[1])};
  }

  _changeSerieName = (event) => {
    let {value, index} = this._getKeyValue(event);
    return {pie: update(this.props.model, {data: {[index]: {$merge: {name: value}}}} )};
  }

  _changeSeriePoint = (event) => {
    let {value, index} = this._getKeyValue(event);
    return {pie: update(this.props.model, {data: {[index]: {$merge: {y: parseFloat(value.replace(",", "."))}}}} )};
  }

  _changeColor = (event) => {
    let {value, index} = this._getKeyValue(event);
    return {pie: this.props.model, pieThemes: update(this.props.themes, {colors: {$merge: {[index]: value} }})};
  }

  _changePercentage = (event) => {
    return {pie: update(this.props.model, {percentage: {$set: event.target.checked} })};
  }

  _changeCommon = (event) => {
    let {key, value} = this._getKeyValue(event);
    return {pie: update(this.props.model, {[key]: {$set: value}})};
  }

  _change = (method) => (event) => {
    this.props.setStateModal({...method(event), isFirstEditing: false});
  }

  _handlePointPieAdd = () => {
    let serieKey = this.state.serieKey + this.serieKeyInterval;
    let pie = update(this.props.model, {data: {$push: [{name: "", y: null}] }} );
    this.setState({serieKey});
    this.props.setStateModal({pie, isFirstEditing: false});
  }

  _handlePointPieRemove = (index) => {
    let newSeries = this.props.model.data;
    let serieKey = this.state.serieKey - this.serieKeyInterval;
    let pie, pieThemes;
    let newPieThemes = this.props.themes;

    if (newSeries.length === 1) {
      return;
    }

    newSeries.splice(index, 1);
    pie = Object.assign({}, this.props.model, {data: newSeries});

    newPieThemes.colors = newPieThemes.colors.concat(newPieThemes.colors.splice(index, 1));
    pieThemes = Object.assign({}, this.props.themes, newPieThemes);

    this.setState({serieKey});
    this.props.setStateModal({pie, pieThemes, isFirstEditing: false});
  }

  _renderPieFormPoints = () => {
    let series = this.props.model.data || [];
    let key = this.state.serieKey;
    const classNamePrefix = "chart-modal__form__points";

    return series.map(function(serie, index) {
      key++;
      return (
        <div key={"points-" + this.props.chartID + "-" + key} className={classNamePrefix}>
          <div className="chart-modal__form__btn-group">
            <button
              ref={"handlePointPieRemove-" + index}
              className="bs-ui-button bs-ui-button--small bs-ui-button--red chart-modal__form__btn-remove"
              onClick={() => this._handlePointPieRemove(index)}>
              <CloseIcon /> Remover
            </button>
          </div>
          <div className={classNamePrefix + "-header"}>
            <input
              ref={"serieName-" + index}
              key={"name-" + this.props.chartID + "-" + index}
              type="text"
              name={"serieName-" + index}
              className={"bs-ui-form-control__field " + classNamePrefix + "-name"}
              placeholder="Nome da série"
              onChange={this._change(this._changeSerieName)}
              defaultValue={serie.name} />
            <input
              ref={"color-" + index}
              key={"color-" + this.props.chartID + "-" + index}
              type="text"
              name={"color-" + index}
              className={"bs-ui-form-control__field " + classNamePrefix + "-color"}
              placeholder="Cor"
              onChange={this._change(this._changeColor)}
              defaultValue={this.props.themes.colors[index]} />
          </div>
          <div>
            <input
              ref={"seriePoint-" + index}
              key={"point-" + this.props.chartID + "-" + index}
              type="text"
              name={"seriePoint-" + index}
              className="bs-ui-form-control__field"
              placeholder="Valor"
              onChange={this._change(this._changeSeriePoint)}
              defaultValue={serie.y} />
          </div>
        </div>
      );
    }, this);
  }

  _renderPieForm = () => {
    let model = this.props.model;

    return (
      <div>
        <div className="bs-ui-form-control">
          <label className="bs-ui-form-control__label">Título</label>
          <input
            ref="title"
            type="text"
            className="bs-ui-form-control__field"
            placeholder="Ex.: Veja histórico da taxa de analfabetismo no brasil"
            name="title"
            onChange={this._change(this._changeCommon)}
            defaultValue={model.title} />
        </div>
        <div className="bs-ui-form-control">
          <label className="bs-ui-form-control__label">Subtítulo</label>
          <input
            ref="subtitle"
            type="text"
            className="bs-ui-form-control__field"
            placeholder="Ex.: Índice não apresentava um aumento desde 1997"
            name="subtitle"
            onChange={this._change(this._changeCommon)}
            defaultValue={model.subtitle} />
        </div>
        <div className="bs-ui-form-control">
          <label className="bs-ui-form-control__label">Fonte</label>
          <input
            ref="credits"
            type="text"
            className="bs-ui-form-control__field"
            placeholder="Ex.: IBGE"
            name="credits"
            onChange={this._change(this._changeCommon)}
            defaultValue={model.credits} />
        </div>
        <div className="bs-ui-form-control">
          <label
            className="bs-ui-form-control__label">Legenda das séries</label>
          <input
            ref="name"
            type="text"
            className="bs-ui-form-control__field"
            placeholder="Ex.: Anos"
            name="name"
            onChange={this._change(this._changeCommon)}
            value={model.name} />
        </div>
        <div className="bs-ui-form-control">
          <label className="bs-ui-checkbox bs-ui-checkbox--small checkbox-label-space">
            <input
              ref="percentage"
              type="checkbox"
              name="percentage"
              value="percentage"
              checked={model.percentage === true}
              onChange={this._change(this._changePercentage)} />Calcular percentual automaticamente
          </label>
        </div>
        <div className="bs-ui-form-control">
          <label
            className="bs-ui-form-control__label">Séries</label>
          {this._renderPieFormPoints()}
          <div className="new-point chart-modal__form__btn-group">
            <button
              ref="handlePointPieAdd"
              className="bs-ui-button bs-ui-button--small bs-ui-button--blue chart-modal__form__btn-add"
              onClick={() => this._handlePointPieAdd()}>
              <PlusIcon /> Adicionar
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this._renderPieForm();
  }
}

export const pieThemes = {
  "default": {
    colors: [
      "#f45b5b",
      "#8085e9",
      "#8d4654",
      "#7798BF",
      "#aaeeee",
      "#ff0066",
      "#eeaaee",
      "#55BF3B",
      "#DF5353",
      "#7798BF",
      "#aaeeee"
    ]
  }
};

export const pie = {
  title: "",
  subtitle: "",
  credits: "",
  name: "",
  percentage: false,
  data: [{
    name: "",
    y: null
  }]
};
