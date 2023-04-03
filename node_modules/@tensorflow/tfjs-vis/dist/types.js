"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSurfaceInfo(drawable) {
    if (drawable.name != null) {
        return true;
    }
    return false;
}
exports.isSurfaceInfo = isSurfaceInfo;
function isSurface(drawable) {
    if (drawable.drawArea instanceof HTMLElement) {
        return true;
    }
    return false;
}
exports.isSurface = isSurface;
//# sourceMappingURL=types.js.map