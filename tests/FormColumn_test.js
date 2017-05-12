/*
 * Copyright (c) 2017, Globo.com <http://store.backstage.globoi.com/project/jornalismo/chart>
 *
 * License: MIT
 */

import React from "react";

import { mount } from "enzyme";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import FormColumn from "../src/FormColumn";


chai.use(chaiEnzyme());
const expect = chai.expect;

describe("FormColumn", function() {
  const themes = {
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

  const oneSerie = {
    title: "",
    subtitle: "",
    credits: "",
    yAxisTitle: "",
    name: "",
    inverted: false,
    data: [
      ["", null]
    ]
  };

  const twoSeries = {
    title: "",
    subtitle: "",
    credits: "",
    yAxisTitle: "",
    name: "",
    inverted: false,
    data: [
      ["", null],
      ["", null]
    ]
  };

  beforeEach(function() {
    this.data = {};
    this.setStateModal = (data) => {this.data = data;};
    this.oneSerie = mount(<FormColumn themes={themes["default"]} model={oneSerie} setStateModal={this.setStateModal} />);
    this.twoSeries = mount(<FormColumn themes={themes["default"]} model={twoSeries} setStateModal={this.setStateModal} />);
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
    this.oneSerie.ref("title").simulate("change", event);
    expect(this.data.column.title).to.equal("Veja histórico da taxa de analfabetismo no brasil");
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
    this.oneSerie.ref("subtitle").simulate("change", event);
    expect(this.data.column.subtitle).to.equal("Índice não apresentava um aumento desde 1997");
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
    this.oneSerie.ref("credits").simulate("change", event);
    expect(this.data.column.credits).to.equal("IBGE");
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
    this.oneSerie.ref("yAxisTitle").simulate("change", event);
    expect(this.data.column.yAxisTitle).to.equal("Anos");
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
    this.oneSerie.ref("name").simulate("change", event);
    expect(this.data.column.name).to.equal("Meses");
  });

  it("change no inverted (vertical)", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "inverted"
          }
        },
        value: "false"
      }
    };
    this.oneSerie.ref("noInverted").simulate("change", event);
    expect(this.data.column.inverted).to.equal(false);
  });

  it("change inverted (horizontal)", function() {
    const event = {
      target: {
        attributes: {
          name: {
            nodeValue: "inverted"
          }
        },
        value: "true"
      }
    };
    this.oneSerie.ref("inverted").simulate("change", event);
    expect(this.data.column.inverted).to.equal(true);
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
    expect(this.data.column.data[0][0]).to.equal("Nome da série");
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
    expect(this.data.columnThemes.colors[0]).to.equal("#cccccc");
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
    expect(this.data.column.data[0][1]).to.equal(20);
  });

  it("click handlePointColumnAdd one serie", function() {
    this.oneSerie.ref("handlePointColumnAdd").simulate("click");
    expect(this.data.column.data.length).to.equal(2);
  });

  it("click handlePointColumnRemove equal to one serie does not remove", function() {
    this.oneSerie.ref("handlePointColumnRemove-0").simulate("click");
    expect(this.data).to.eql({});
  });

  it("click handlePointColumnRemove greater than or equal to two series does remove", function() {
    this.twoSeries.ref("handlePointColumnRemove-1").simulate("click");
    expect(this.data.column.data.length).to.equal(1);
  });
});
