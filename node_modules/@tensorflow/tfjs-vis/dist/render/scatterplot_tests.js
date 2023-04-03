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
const scatterplot_1 = require("./scatterplot");
describe('renderScatterplot', () => {
    let pixelRatio;
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        pixelRatio = window.devicePixelRatio;
    });
    it('renders a scatterplot', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [
                { x: 0, y: 50 },
                { x: 1, y: 100 },
                { x: 2, y: 230 },
            ]
        };
        const container = document.getElementById('container');
        yield scatterplot_1.scatterplot(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('renders the chart with multiple series', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [
                [
                    { x: 0, y: 50 },
                    { x: 1, y: 100 },
                    { x: 2, y: 230 },
                ],
                [
                    { x: 0, y: 20 },
                    { x: 1, y: 300 },
                    { x: 2, y: 630 },
                ],
            ]
        };
        const container = document.getElementById('container');
        yield scatterplot_1.scatterplot(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        yield scatterplot_1.scatterplot(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('renders a line chart with multiple series custom names', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [
                [
                    { x: 0, y: 50 },
                    { x: 1, y: 100 },
                    { x: 2, y: 230 },
                ],
                [
                    { x: 0, y: 20 },
                    { x: 1, y: 300 },
                    { x: 2, y: 630 },
                ],
            ],
            series: ['First', 'Second'],
        };
        const container = document.getElementById('container');
        yield scatterplot_1.scatterplot(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('updates the chart', () => __awaiter(this, void 0, void 0, function* () {
        let data = {
            values: [
                [
                    { x: 0, y: 50 },
                    { x: 1, y: 100 },
                    { x: 2, y: 230 },
                ],
                [
                    { x: 0, y: 20 },
                    { x: 1, y: 300 },
                    { x: 2, y: 630 },
                ],
            ],
            series: ['First', 'Second'],
        };
        const container = document.getElementById('container');
        yield scatterplot_1.scatterplot(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        data = {
            values: [
                [
                    { x: 0, y: 50 },
                    { x: 1, y: 100 },
                    { x: 2, y: 230 },
                ],
                [
                    { x: 0, y: 20 },
                    { x: 1, y: 300 },
                    { x: 2, y: 630 },
                    { x: 3, y: 530 },
                    { x: 4, y: 230 },
                ],
            ],
            series: ['First', 'Second'],
        };
        yield scatterplot_1.scatterplot(container, data);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('sets width of chart', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [
                { x: 0, y: 50 },
                { x: 1, y: 100 },
                { x: 2, y: 230 },
            ]
        };
        const container = document.getElementById('container');
        yield scatterplot_1.scatterplot(container, data, { width: 400 });
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('canvas').length).toBe(1);
        expect(document.querySelector('canvas').width).toBe(400 * pixelRatio);
    }));
    it('sets height of chart', () => __awaiter(this, void 0, void 0, function* () {
        const data = {
            values: [
                { x: 0, y: 50 },
                { x: 1, y: 100 },
                { x: 2, y: 230 },
            ]
        };
        const container = document.getElementById('container');
        yield scatterplot_1.scatterplot(container, data, { height: 200 });
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('canvas').length).toBe(1);
        expect(document.querySelector('canvas').height).toBe(200 * pixelRatio);
    }));
});
//# sourceMappingURL=scatterplot_tests.js.map