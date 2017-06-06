/*
 * Copyright (c) 2017, Globo.com <http://github.com/globocom/megadraft-chart-plugin>
 *
 * License: MIT
 */

import React from "react";
import {insertDataBlock} from "megadraft";

import constants from "./constants";
import {PluginIcon} from "./icon";

import ModalChart from "./ModalChart";
import BaseEditComponent from "./BaseEditComponent";

export default class Button extends BaseEditComponent {
  constructor(props) {
    super(props);
    this.onSave = ::this.onSave;
  }

  onSave(chart) {
    this.onModalClose();
    const data = {
      type: constants.PLUGIN_TYPE,
      chart
    };

    this.props.onChange(insertDataBlock(this.props.editorState, data));
  }

  render() {
    return (
      <div>
        <button className={this.props.className} type="button" onClick={this.handleEdit} title="Gráfico">
          <PluginIcon className="sidemenu__button__icon" />
        </button>
        <ModalChart
          isOpen={this.state.isModalOpen}
          tenant={this.tenant}
          onCloseRequest={this.onModalClose}
          onSaveRequest={this.onSave}
        />
      </div>
    );
  }
}
