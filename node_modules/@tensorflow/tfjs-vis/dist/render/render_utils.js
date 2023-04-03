"use strict";
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const visor_1 = require("../visor");
function getDrawArea(drawable) {
    if (drawable instanceof HTMLElement) {
        return drawable;
    }
    else if (types_1.isSurface(drawable)) {
        return drawable.drawArea;
    }
    else if (types_1.isSurfaceInfo(drawable)) {
        const surface = visor_1.visor().surface({ name: drawable.name, tab: drawable.tab, styles: drawable.styles });
        return surface.drawArea;
    }
    else {
        throw new Error('Not a drawable');
    }
}
exports.getDrawArea = getDrawArea;
function shallowEquals(
// tslint:disable-next-line:no-any
a, b) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) {
        return false;
    }
    for (let i = 0; i < aProps.length; i++) {
        const prop = aProps[i];
        if (a[prop] !== b[prop]) {
            return false;
        }
    }
    return true;
}
exports.shallowEquals = shallowEquals;
function nextFrame() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise(r => requestAnimationFrame(r));
    });
}
exports.nextFrame = nextFrame;
//# sourceMappingURL=render_utils.js.map