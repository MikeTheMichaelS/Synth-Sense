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
const index_1 = require("../index");
const render_utils_1 = require("./render_utils");
describe('shallowEqual', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
    });
    it('returns true for similar objects', () => __awaiter(this, void 0, void 0, function* () {
        const a = {
            stringProp: 'astring',
            numProp: 55,
            boolProp: true,
        };
        const b = {
            stringProp: 'astring',
            boolProp: true,
            numProp: 55,
        };
        expect(render_utils_1.shallowEquals(a, b)).toBe(true);
    }));
    it('returns false for different objects', () => __awaiter(this, void 0, void 0, function* () {
        const a = {
            stringProp: 'astring',
            numProp: 55,
            boolProp: false,
        };
        const b = {
            stringProp: 'astring',
            numProp: 55,
            boolProp: true,
        };
        expect(render_utils_1.shallowEquals(a, b)).toBe(false);
    }));
    it('returns true for similar objects (array ref)', () => __awaiter(this, void 0, void 0, function* () {
        // tslint:disable-next-line:no-any
        const ref = [];
        const a = {
            stringProp: 'astring',
            numProp: 55,
            refProp: ref,
        };
        const b = {
            numProp: 55,
            stringProp: 'astring',
            refProp: ref,
        };
        expect(render_utils_1.shallowEquals(a, b)).toBe(true);
    }));
});
describe('getDrawArea', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
    });
    it('works with HTMLElement', () => __awaiter(this, void 0, void 0, function* () {
        const el = document.getElementById('container');
        expect(render_utils_1.getDrawArea(el)).toEqual(el);
    }));
    it('works with a surface', () => __awaiter(this, void 0, void 0, function* () {
        const surface = index_1.visor().surface({ name: 'test' });
        expect(render_utils_1.getDrawArea(surface)).toEqual(surface.drawArea);
    }));
    it('fails with other stuff', () => __awaiter(this, void 0, void 0, function* () {
        const surface = index_1.visor().surface({ name: 'test' });
        //@ts-ignore
        expect(() => render_utils_1.getDrawArea('not-a-surface')).toThrow();
    }));
});
//# sourceMappingURL=render_utils_test.js.map