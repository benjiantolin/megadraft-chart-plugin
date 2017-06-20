/*
 * Copyright (c) 2017, Globo.com <https://github.com/globocom/megadraft-chart-plugin>
 *
 * License: MIT
 */

import React from "react";

import { mount } from "enzyme";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";

import FormColumn from "../src/FormColumn";
import {
  Themes,
  ColumnOptionsOneSerie,
  ColumnOptionsTwoSeries
} from "./fixtures";


chai.use(chaiEnzyme());
const expect = chai.expect;

describe("FormColumn", function() {

  beforeEach(function() {
    this.data = {};
    this.setStateModal = (data) => {
      this.data = data;
    };
    this.oneSerie = mount(
      <FormColumn
        model={{options: ColumnOptionsOneSerie, themes: Themes["default"]}}
        chartType="column"
        setStateModal={this.setStateModal} />
    );
    this.twoSeries = mount(
      <FormColumn
        model={{options: ColumnOptionsTwoSeries, themes: Themes["default"]}}
        chartType="column"
        setStateModal={this.setStateModal} />
    );
  });

  it("exist", function() {
    expect(this.oneSerie).to.exist;
  });

  it("change title", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "title"
          }
        },
        value: "Veja histórico da taxa de analfabetismo no brasil"
      }
    };
    this.oneSerie.find("input[name='title']").first().simulate("change", event);
    expect(this.data.options.title).to.equal("Veja histórico da taxa de analfabetismo no brasil");
  });

  it("change subtitle", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "subtitle"
          }
        },
        value: "Índice não apresentava um aumento desde 1997"
      }
    };
    this.oneSerie.find("input[name='subtitle']").first().simulate("change", event);
    expect(this.data.options.subtitle).to.equal("Índice não apresentava um aumento desde 1997");
  });

  it("change credits", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "credits"
          }
        },
        value: "IBGE"
      }
    };
    this.oneSerie.find("input[name='credits']").first().simulate("change", event);
    expect(this.data.options.credits).to.equal("IBGE");
  });

  it("change yAxisTitle", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "yAxisTitle"
          }
        },
        value: "Anos"
      }
    };
    this.oneSerie.find("input[name='yAxisTitle']").first().simulate("change", event);
    expect(this.data.options.yAxisTitle).to.equal("Anos");
  });

  it("change name", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "name"
          }
        },
        value: "Meses"
      }
    };
    this.oneSerie.find("input[name='name']").first().simulate("change", event);
    expect(this.data.options.name).to.equal("Meses");
  });

  it("change no inverted (vertical)", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "noInverted"
          }
        },
        value: "false"
      }
    };
    this.oneSerie.find("input[name='noInverted']").first().simulate("change", event);
    expect(this.data.options.inverted).to.equal(false);
  });

  it("change inverted (horizontal)", function() {
    const event = {
      target: {
        value: "true"
      }
    };
    this.oneSerie.find("input[name='inverted']").first().simulate("change", event);
    expect(this.data.options.inverted).to.equal(true);
  });

  it("change serie name", function() {
    const event = {
      target: {
        value: "Nome da série"
      }
    };
    this.oneSerie.find("input[name='serieName-0']").simulate("change", event);
    expect(this.data.options.data[0].name).to.equal("Nome da série");
  });

  it("change color", function() {
    const event = {
      target: {
        value: "#cccccc"
      }
    };
    this.oneSerie.find("input[name='color-0']").simulate("change", event);
    expect(this.data.themes.colors[0]).to.equal("#cccccc");
  });

  it("change serie point", function() {
    const event = {
      target: {
        value: "20"
      }
    };
    this.oneSerie.find("input[name='seriePoint-0-0']").simulate("change", event);
    expect(this.data.options.data[0].value[0]).to.equal("20");
  });

  it("click handlePointColumnAdd one serie", function() {
    this.oneSerie.find("button[name='handlePointAdd']").first().simulate("click");
    expect(this.data.options.data.length).to.equal(2);
  });

  it("button Remove is not rendered if there is only one serie", function() {
    const expectedLength = this.oneSerie.find("button[name='handlePointRemove-0']").length;
    expect(expectedLength).to.equal(0);
  });

  it("click handlePointColumnRemove greater than or equal to two series does remove", function() {
    this.twoSeries.find("button[name='handlePointRemove-1']").first().simulate("click");
    expect(this.data.options.data.length).to.equal(1);
  });
});
