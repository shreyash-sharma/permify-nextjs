"use strict";
"use client";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = EntityHasAccess;
var _react = _interopRequireWildcard(require("react"));
var _permifyClient = require("@/lib/permifyClient");
var _reactRole = require("@permify/react-role");
var _PermissionsContext = require("./PermissionsContext");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
/**
 * Entity-based access control component that handles access permissions
 * @param {Object} props - Component props
 * @param {string} props.component_id - ID of the entity/component to check access for
 * @param {React.ReactNode} props.children - Content to show if access is granted
 * @param {React.ReactNode} props.fallback - Content to show if access is denied (default: null)
 * @param {function} props.renderDisabled - Optional function to render a disabled version of children
 */
function EntityHasAccess(_ref) {
  var component_id = _ref.component_id,
    children = _ref.children,
    _ref$fallback = _ref.fallback,
    fallback = _ref$fallback === void 0 ? null : _ref$fallback,
    renderDisabled = _ref.renderDisabled;
  var _usePermissions = (0, _PermissionsContext.usePermissions)(),
    user = _usePermissions.user;
  var permissions = (user === null || user === void 0 ? void 0 : user.permissions) || [];
  console.log("[EntityHasAccess] user in context:", user, 'for', component_id);
  console.log("[EntityHasAccess] permissions in context:", permissions, 'for', component_id);
  if (user === undefined) {
    console.log("[EntityHasAccess] Waiting for user/permissions for", component_id);
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "flex justify-center items-center p-2"
    }, /*#__PURE__*/_react["default"].createElement("span", {
      className: "animate-spin mr-2"
    }, "\uD83D\uDD04"), "Loading...");
  }
  var hasNormal = permissions.some(function (p) {
    return p.id === component_id;
  });
  var hasDisabled = permissions.some(function (p) {
    return p.id === "".concat(component_id, ".disabled") || p.id === "".concat(component_id, ".disable");
  });
  if (!hasNormal && !hasDisabled) {
    return fallback;
  }
  if (hasDisabled) {
    if (typeof children === "function") {
      console.log("[EntityHasAccess] Passing disabled=true to child function for ".concat(component_id));
      return children({
        disabled: true
      });
    } else if (/*#__PURE__*/_react["default"].isValidElement(children)) {
      console.log("[EntityHasAccess] Cloning child element with disabled=true for ".concat(component_id));
      return /*#__PURE__*/_react["default"].cloneElement(children, {
        disabled: true,
        className: "".concat(children.props.className || "", " opacity-60 pointer-events-none")
      });
    } else {
      console.log("[EntityHasAccess] Wrapping child in div with aria-disabled=true for ".concat(component_id));
      return /*#__PURE__*/_react["default"].createElement("div", {
        "aria-disabled": "true",
        className: "opacity-60 pointer-events-none"
      }, children);
    }
  }
  if (typeof children === "function") {
    console.log("[EntityHasAccess] Passing disabled=false to child function for ".concat(component_id));
    return children({
      disabled: false
    });
  }
  console.log("[EntityHasAccess] Rendering child as-is for ".concat(component_id));
  return children;
}