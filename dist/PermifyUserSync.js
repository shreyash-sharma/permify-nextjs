"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PermifyUserSync;
var _react = require("react");
var _PermissionsContext = require("./PermissionsContext");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function PermifyUserSync(_ref) {
  var useAuth = _ref.useAuth,
    initializePermissions = _ref.initializePermissions;
  var _usePermissions = (0, _PermissionsContext.usePermissions)(),
    setUser = _usePermissions.setUser;
  var _useAuth = useAuth(),
    userInfo = _useAuth.userInfo;
  (0, _react.useEffect)(function () {
    var userid = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userPrincipalName) || (userInfo === null || userInfo === void 0 ? void 0 : userInfo.mail);
    if (userid) {
      initializePermissions(userid).then(function (data) {
        var _data$user;
        setUser(_objectSpread(_objectSpread({}, userInfo), {}, {
          permissions: ((_data$user = data.user) === null || _data$user === void 0 || (_data$user = _data$user.allowedEntities) === null || _data$user === void 0 ? void 0 : _data$user.access) || []
        }));
      })["catch"](function (error) {
        setUser(_objectSpread(_objectSpread({}, userInfo), {}, {
          permissions: []
        }));
      });
    }
  }, [userInfo, setUser, initializePermissions]);
  return null;
}