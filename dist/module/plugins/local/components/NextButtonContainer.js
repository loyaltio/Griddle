'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _localSelectors = require('../selectors/localSelectors');

var _actions = require('../../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enhance = function enhance(OriginalComponent) {
  return (0, _reactRedux.connect)(function (state) {
    return {
      hasNext: (0, _localSelectors.hasNextSelector)(state),
      className: (0, _localSelectors.classNamesForComponentSelector)(state, 'NextButton'),
      style: (0, _localSelectors.stylesForComponentSelector)(state, 'NextButton')
    };
  }, {
    getNext: _actions.getNext
  })(function (props) {
    return _react2.default.createElement(OriginalComponent, _extends({}, props, { onClick: props.getNext, text: 'Next' }));
  });
};

exports.default = enhance;