/*
 * Copyright (c) 2017, Globo.com <http://store.backstage.globoi.com/project/jornalismo/chart>
 *
 * License: MIT
 */

import React, {Component} from "react";
import update from "immutability-helper";

import BaseForm, { defaultThemes, defaultChartData } from "./form/baseForm";
import {COMMON_FIELDS} from "./form/commonFields";
import { PlusIcon, CloseIcon } from "./icon";
import { FormCloseButton, FormPlusButton } from "./form/buttonsForm";
import { TextInput } from "./form/inputs";


let lineFields = COMMON_FIELDS.concat([
  {
    name: "yAxisTitle",
    label: "Legenda do eixo Y",
    placeholder: "Ex.: Anos"
  }
]);


export default class FormLine extends Component {
  _changeCategory = (event, index) => {
    let value = event.target.value;
    this.props.setStateModal({line: update(this.props.model, {categories: {$merge: {[index]: value} }})});
  }

  _changeLabels = (event) => {
    this.props.setStateModal({line: update(this.props.model, {labels: {$set: event.target.checked} })});
  }

  _addPoint = () => {
    let line = JSON.parse(JSON.stringify(this.props.model));
    line.numberOfMarkers++;
    line.data.map(function(object) {
      object.value.push(null);
    });
    line.categories = line.categories.concat(new Array(1).fill(""));
    this.props.setStateModal({line});
  }

  _removePoint = () => {
    let line = JSON.parse(JSON.stringify(this.props.model));
    line.numberOfMarkers--;
    if (line.numberOfMarkers === 0) {
      return;
    }
    line.data.map(function(object) {
      object.value.pop();
    });
    line.categories = line.categories.slice(0, line.numberOfMarkers);
    this.props.setStateModal({line});
  }

  _renderLineFormCategories = () => {
    let categories = this.props.model.categories || [];
    const classNameFormPrefix = "chart-modal__form";

    return (
      <div className={classNameFormPrefix + "__points-container"}>
        {categories.map(function(category, index) {
          return (
            <TextInput
              key={"point-" + this.props.chartID + "-" + index}
              name={"category-" + index}
              className={classNameFormPrefix + "__point"}
              placeholder="Categoria"
              onChange={(event) => this._changeCategory(event, index)}
              defaultValue={category}
            />
          );
        }, this)}
      </div>
    );
  }

  render() {
    let model = this.props.model;

    return (
      <div>
        <BaseForm
          model={model}
          fields={lineFields}
          themes={this.props.themes}
          chartType={this.props.chartType}
          chartID={this.props.chartID}
          setStateModal={this.props.setStateModal}
        >
          <div className="bs-ui-form-control">
            <label className="bs-ui-checkbox bs-ui-checkbox--small checkbox-label-space">
              <input
                ref="labels"
                type="checkbox"
                name="labels"
                value="labels"
                checked={model.labels === true}
                onChange={this._changeLabels} />Tornar labels visíveis
            </label>
          </div>
          <div className="bs-ui-form-control">
            <label
              className="bs-ui-form-control__label chart-modal__form__label-category">Categorias do eixo X</label>
            <div className="chart-modal__form__btn-group">
              {
                (this.props.model.categories.length > 1)
                  ? <FormCloseButton
                      name="removePoint"
                      onClick={this._removePoint}>
                      <CloseIcon/> Remover
                    </FormCloseButton>
                  : ""
              }
              <FormPlusButton
                name="addPoint"
                onClick={ this._addPoint}>
                <PlusIcon/> Adicionar
              </FormPlusButton>
            </div>
            {this._renderLineFormCategories()}
          </div>
        </BaseForm>
      </div>
    );
  }
}

export const lineThemes = Object.assign({}, defaultThemes);
export const line = {
  ...defaultChartData,
  data: [{
    name: "",
    value: [null, null, null]
  }],
  yAxisTitle: "",
  labels: false,
  numberOfMarkers: 3,
  categories: ["", "", ""]
};
