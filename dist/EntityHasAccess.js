"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = EntityHasAccess;
var _react = _interopRequireDefault(require("react"));
var _PermissionsContext = require("./PermissionsContext");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Entity-based access control component that handles access permissions
 * @param {Object} props - Component props
 * @param {string} props.component_id - ID of the entity/component to check access for
 * @param {React.ReactNode} props.children - Content to show if access is granted
 * @param {React.ReactNode} props.fallback - Content to show if access is denied (default: null)
 * @param {function} props.renderDisabled - Optional function to render a disabled version of children
 * @param {function} [props.getComponentAccessStatus] - (Optional) Function to check access, provided by the consumer app
 */
function EntityHasAccess(_ref) {
  var component_id = _ref.component_id,
    children = _ref.children,
    _ref$fallback = _ref.fallback,
    fallback = _ref$fallback === void 0 ? null : _ref$fallback,
    renderDisabled = _ref.renderDisabled,
    getComponentAccessStatus = _ref.getComponentAccessStatus;
  var _usePermissions = (0, _PermissionsContext.usePermissions)(),
    user = _usePermissions.user;
  var permissions = (user === null || user === void 0 ? void 0 : user.permissions) || [];

  // If the consumer provides a custom access check function, use it
  var hasNormal, hasDisabled;
  if (typeof getComponentAccessStatus === "function") {
    var status = getComponentAccessStatus(component_id, permissions);
    hasNormal = status === "normal" || status === true;
    hasDisabled = status === "disabled";
  } else {
    // Default logic: check permissions array for id matches
    hasNormal = permissions.some(function (p) {
      return p.id === component_id;
    });
    hasDisabled = permissions.some(function (p) {
      return p.id === "".concat(component_id, ".disabled") || p.id === "".concat(component_id, ".disable");
    });
  }
  if (user === undefined) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "flex justify-center items-center p-2"
    }, /*#__PURE__*/_react["default"].createElement("span", {
      className: "animate-spin mr-2"
    }, "\uD83D\uDD04"), "Loading...");
  }
  if (!hasNormal && !hasDisabled) {
    return fallback;
  }
  if (hasDisabled) {
    if (typeof children === "function") {
      return children({
        disabled: true
      });
    } else if (/*#__PURE__*/_react["default"].isValidElement(children)) {
      return /*#__PURE__*/_react["default"].cloneElement(children, {
        disabled: true,
        className: "".concat(children.props.className || "", " opacity-60 pointer-events-none")
      });
    } else {
      return /*#__PURE__*/_react["default"].createElement("div", {
        "aria-disabled": "true",
        className: "opacity-60 pointer-events-none"
      }, children);
    }
  }
  if (typeof children === "function") {
    return children({
      disabled: false
    });
  }
  return children;
}