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
const history_1 = require("./history");
describe('fitCallbacks', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
    });
    it('returns two callbacks', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const callbacks = history_1.fitCallbacks(container, ['loss', 'acc']);
        expect(typeof (callbacks.onEpochEnd)).toEqual('function');
        expect(typeof (callbacks.onBatchEnd)).toEqual('function');
    }));
    it('returns one callback', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const callbacks = history_1.fitCallbacks(container, ['loss', 'acc'], {
            callbacks: ['onBatchEnd'],
        });
        expect(callbacks.onEpochEnd).toEqual(undefined);
        expect(typeof (callbacks.onBatchEnd)).toEqual('function');
    }));
    it('onEpochEnd callback can render logs', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const callbacks = history_1.fitCallbacks(container, ['loss', 'val_loss', 'acc', 'val_acc']);
        const l1 = { loss: 0.5, 'val_loss': 0.7 };
        const l2 = { loss: 0.2, acc: 0.6, 'val_loss': 0.5, 'val_acc': 0.3 };
        yield callbacks.onEpochEnd(0, l1);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('div[data-name="loss"]').length).toBe(1);
        yield callbacks.onEpochEnd(1, l2);
        expect(document.querySelectorAll('.vega-embed').length).toBe(2);
        expect(document.querySelectorAll('div[data-name="loss"]').length).toBe(1);
        expect(document.querySelectorAll('div[data-name="acc"]').length).toBe(1);
    }));
    it('onBatchEnd callback can render logs', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const callbacks = history_1.fitCallbacks(container, ['loss', 'acc']);
        const l1 = { loss: 0.5 };
        const l2 = { loss: 0.2, acc: 0.6 };
        yield callbacks.onBatchEnd(0, l1);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
        expect(document.querySelectorAll('div[data-name="loss"]').length).toBe(1);
        yield callbacks.onBatchEnd(1, l2);
        expect(document.querySelectorAll('.vega-embed').length).toBe(2);
        expect(document.querySelectorAll('div[data-name="loss"]').length).toBe(1);
        expect(document.querySelectorAll('div[data-name="acc"]').length).toBe(1);
    }));
});
describe('history', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
    });
    it('renders a logs[]', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const logs = [{ loss: 0.5 }, { loss: 0.3 }];
        const metrics = ['loss'];
        yield history_1.history(container, logs, metrics);
        expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    }));
    it('renders a logs object with multiple metrics', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const logs = [{ loss: 0.2, acc: 0.6 }, { loss: 0.1, acc: 0.65 }];
        const metrics = ['loss', 'acc'];
        yield history_1.history(container, logs, metrics);
        expect(document.querySelectorAll('.vega-embed').length).toBe(2);
    }));
    it('renders a history object with multiple metrics', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const hist = {
            history: {
                'loss': [0.7, 0.3, 0.2],
                'acc': [0.2, 0.3, 0.21],
            }
        };
        const metrics = ['loss', 'acc'];
        yield history_1.history(container, hist, metrics);
        expect(document.querySelectorAll('.vega-embed').length).toBe(2);
    }));
    it('can render multiple history objects', () => __awaiter(this, void 0, void 0, function* () {
        const container = { name: 'Test' };
        const container2 = { name: 'Other Test' };
        const hist = {
            history: {
                'loss': [0.7, 0.3, 0.2],
                'acc': [0.2, 0.3, 0.21],
            }
        };
        yield history_1.history(container, hist, ['loss']);
        yield history_1.history(container2, hist, ['acc']);
        expect(document.querySelectorAll('.vega-embed').length).toBe(2);
    }));
});
//# sourceMappingURL=history_test.js.map