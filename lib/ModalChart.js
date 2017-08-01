"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _backstageModal = require("backstage-modal");

var _backstageModal2 = _interopRequireDefault(_backstageModal);

var _backstageTabs = require("backstage-tabs");

var _backstageTabs2 = _interopRequireDefault(_backstageTabs);

var _Chart = require("./Chart");

var _Chart2 = _interopRequireDefault(_Chart);

var _Line = require("./forms/Line");

var _Line2 = _interopRequireDefault(_Line);

var _Column = require("./forms/Column");

var _Column2 = _interopRequireDefault(_Column);

var _Pie = require("./forms/Pie");

var _Pie2 = _interopRequireDefault(_Pie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (c) 2017, Globo.com <httpss://github.com/globocom/megadraft-table-plugin>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * License: MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/* global __ */

var FormByChartType = {
  line: _Line2.default,
  column: _Column2.default,
  pie: _Pie2.default
};

var TabsByChartType = [{
  value: "line",
  label: __("Line")
}, {
  value: "column",
  label: __("Column")
}, {
  value: "pie",
  label: __("Pie")
}];

var ModalChart = function (_Component) {
  _inherits(ModalChart, _Component);

  function ModalChart(props) {
    _classCallCheck(this, ModalChart);

    var _this = _possibleConstructorReturn(this, (ModalChart.__proto__ || Object.getPrototypeOf(ModalChart)).call(this, props));

    _this.state = _this.buildChartState(_this.props);

    _this.onSaveRequest = _this.onSaveRequest.bind(_this);
    _this.setStateModal = _this.setStateModal.bind(_this);
    return _this;
  }

  _createClass(ModalChart, [{
    key: "getInitialChartState",
    value: function getInitialChartState(props) {
      return {
        chartType: "line",
        line: {
          themes: Object.assign(props.theme),
          options: _Line.lineInitial
        },
        column: {
          themes: Object.assign(props.theme),
          options: _Column.columnInitial
        },
        pie: {
          themes: Object.assign(props.theme),
          options: _Pie.pieInitial
        }
      };
    }
  }, {
    key: "buildChartState",
    value: function buildChartState(props) {
      var state = this.getInitialChartState(props);

      if (props.chart) {
        state[props.chart.type].options = Object.assign({}, props.chart.options);
        state[props.chart.type].themes = Object.assign({}, props.chart.themes);
        state.chartType = props.chart.type;
      }
      return state;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props !== nextProps) {
        var state = this.buildChartState(nextProps);
        this.setState(state);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.isOpen || this.props.isOpen || false;
    }
  }, {
    key: "handleChartType",
    value: function handleChartType(chartType) {
      this.setState({ chartType: chartType });
    }
  }, {
    key: "_encodeOptimizedSVGDataUri",
    value: function _encodeOptimizedSVGDataUri(svgString) {
      var uriPayload = encodeURIComponent(svgString.replace(/\n+/g, "")) // remove newlines and encode URL-unsafe characters
      .replace(/%20/g, " ") // put spaces back in
      .replace(/%3D/g, "=") // ditto equals signs
      .replace(/%3A/g, ":") // ditto colons
      .replace(/%2F/g, "/") // ditto slashes
      .replace(/%22/g, "'"); // replace quotes with apostrophes (may break certain SVGs)

      return uriPayload;
    }
  }, {
    key: "onSaveRequest",
    value: function onSaveRequest() {
      var themes = this.state[this.state.chartType].themes;
      var options = this.state[this.state.chartType].options;
      var svgData = this._encodeOptimizedSVGDataUri(this.chartComponent.chart.getSVG());

      this.props.onSaveRequest({
        type: this.state.chartType,
        themes: themes,
        options: options,
        svg: svgData
      });
    }
  }, {
    key: "setStateModal",
    value: function setStateModal(data) {
      var newState = {};
      newState[this.state.chartType] = data;
      this.setState(newState);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var currentChartType = this.state.chartType;
      var FormComponent = FormByChartType[currentChartType];
      return _react2.default.createElement(
        _backstageModal2.default,
        { className: "chart-modal",
          title: __("Chart"),
          isOpen: this.props.isOpen,
          onCloseRequest: this.props.onCloseRequest,
          width: "98%",
          height: "96%" },
        _react2.default.createElement(
          _backstageModal.ModalBody,
          { ref: "body" },
          _react2.default.createElement(
            "div",
            { className: "chart-modal__form" },
            _react2.default.createElement(_backstageTabs2.default, {
              tabs: TabsByChartType, activeTab: currentChartType,
              onClickTab: function onClickTab(clickedTab) {
                return _this2.handleChartType(clickedTab.value);
              }
            }),
            _react2.default.createElement(FormComponent, {
              model: this.state[currentChartType],
              setStateModal: this.setStateModal })
          ),
          _react2.default.createElement(
            "div",
            { className: "chart-modal__chart" },
            _react2.default.createElement(_Chart2.default, {
              id: "chart-modal__preview",
              ref: function ref(chartComponent) {
                _this2.chartComponent = chartComponent;
              },
              theme: this.state[currentChartType].themes,
              data: this.state[currentChartType].options,
              type: currentChartType })
          )
        ),
        _react2.default.createElement(
          _backstageModal.ModalFooter,
          null,
          _react2.default.createElement(
            "button",
            {
              className: "chart-add-button bs-ui-button bs-ui-button--background-blue bs-ui-button--small",
              onClick: this.onSaveRequest },
            __("apply")
          )
        )
      );
    }
  }]);

  return ModalChart;
}(_react.Component);

exports.default = ModalChart;