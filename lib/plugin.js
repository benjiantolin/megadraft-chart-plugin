"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Button = require("./Button");

var _Button2 = _interopRequireDefault(_Button);

var _Block = require("./Block");

var _Block2 = _interopRequireDefault(_Block);

var _constants = require("./constants");

var _constants2 = _interopRequireDefault(_constants);

var _themes = require("./themes");

var _themes2 = _interopRequireDefault(_themes);

var _Base = require("./forms/Base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /*
                                                                                                                                                                                                                              * Copyright (c) 2017, Globo.com <https://github.com/globocom/megadraft-chart-plugin>
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              * License: MIT
                                                                                                                                                                                                                              */

/* global __ */

function ComponentThemeWrapperFactory(ComponentWrapped) {
  return function (_ref) {
    var props = _objectWithoutProperties(_ref, []);

    return _react2.default.createElement(ComponentWrapped, _extends({}, props, { theme: Plugin.custom.theme || _themes2.default.default }));
  };
}

var Plugin = {
  title: __("Chart"),
  type: _constants2.default.PLUGIN_TYPE,
  buttonComponent: ComponentThemeWrapperFactory(_Button2.default),
  blockComponent: ComponentThemeWrapperFactory(_Block2.default),
  custom: {
    baseFormConfig: _Base.BaseFormConfig
  },
  options: {
    defaultDisplay: "",
    displayOptions: []
  }
};

exports.default = Plugin;