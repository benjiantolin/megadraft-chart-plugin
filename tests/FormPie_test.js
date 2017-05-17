/*
 * Copyright (c) 2017, Globo.com <http://store.backstage.globoi.com/project/jornalismo/chart>
 *
 * License: MIT
 */

import React from "react";

import { mount } from "enzyme";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import FormPie from "../src/FormPie";
import {
  Themes,
  PieOptionsOneSerie,
  PieOptionsTwoSeries
} from "./fixtures";


chai.use(chaiEnzyme());
const expect = chai.expect;

describe("FormPie", function() {

  beforeEach(function() {
    this.data = {};
    this.setStateModal = (data) => {
      this.data = data;
    };
    this.oneSerie = mount(
      <FormPie
        themes={Themes["default"]}
        model={PieOptionsOneSerie}
        setStateModal={this.setStateModal} />
    );
    this.twoSeries = mount(
      <FormPie
        themes={Themes["default"]}
        model={PieOptionsTwoSeries}
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
    expect(this.data.pie.title).to.equal("Veja histórico da taxa de analfabetismo no brasil");
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
    expect(this.data.pie.subtitle).to.equal("Índice não apresentava um aumento desde 1997");
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
    expect(this.data.pie.credits).to.equal("IBGE");
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
    expect(this.data.pie.name).to.equal("Meses");
  });

  it("change percentage", function() {
    const event = {
      target: {
        checked: true
      }
    };
    this.oneSerie.ref("percentage").simulate("change", event);
    expect(this.data.pie.percentage).to.equal(true);
  });

  it("change serie name", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "serieName-0"
          }
        },
        value: "Nome da série"
      }
    };
    this.oneSerie.ref("serieName-0").simulate("change", event);
    expect(this.data.pie.data[0].name).to.equal("Nome da série");
  });

  it("change color", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "color-0"
          }
        },
        value: "#cccccc"
      }
    };
    this.oneSerie.ref("color-0").simulate("change", event);
    expect(this.data.pieThemes.colors[0]).to.equal("#cccccc");
  });

  it("change serie point", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "seriePoint-0"
          }
        },
        value: "20"
      }
    };
    this.oneSerie.ref("seriePoint-0").simulate("change", event);
    expect(this.data.pie.data[0].y).to.equal(20);
  });

  it("click handlePointPieAdd one serie", function() {
    this.oneSerie.find("button[name='handlePointPieAdd']").first().simulate("click");
    expect(this.data.pie.data.length).to.equal(2);
  });

  it("click handlePointPieRemove equal to one serie does not remove", function() {
    this.oneSerie.find("button[name='handlePointPieRemove-0']").first().simulate("click");
    expect(this.data).to.eql({});
  });

  it("click handlePointPieRemove greater than or equal to two series does remove", function() {
    this.twoSeries.find("button[name='handlePointPieRemove-1']").first().simulate("click");
    expect(this.data.pie.data.length).to.equal(1);
  });
});
