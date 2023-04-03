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
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("preact");
const preact_render_spy_1 = require("preact-render-spy");
const visor_1 = require("./visor");
afterEach(() => {
    document.body.innerHTML = '';
});
describe('Visor Component', () => {
    it('renders an empty visor', () => {
        const wrapper = preact_render_spy_1.render(preact_1.h(visor_1.VisorComponent, { surfaceList: [] }));
        expect(wrapper.find('.visor').length).toBe(1);
        expect(wrapper.find('.visor-surfaces').length).toBe(1);
        expect(wrapper.find('.tf-surface').length).toBe(0);
        expect(wrapper.state().isOpen).toBe(true);
        expect(wrapper.state().isFullscreen).toBe(false);
    });
    it('renders an empty and closed visor', () => {
        const wrapper = preact_render_spy_1.render(preact_1.h(visor_1.VisorComponent, { surfaceList: [], startOpen: false }));
        expect(wrapper.find('.visor').length).toBe(1);
        expect(wrapper.state().isOpen).toBe(false);
        expect(wrapper.state().isFullscreen).toBe(false);
    });
    it('renders a surface', () => {
        const surfaceList = [
            { name: 'surface 1', tab: 'tab 1' },
        ];
        const wrapper = preact_render_spy_1.render(preact_1.h(visor_1.VisorComponent, { surfaceList: surfaceList }));
        expect(wrapper.find('.tf-surface').length).toBe(1);
        expect(wrapper.find('.tf-surface').text()).toMatch('surface 1');
        expect(wrapper.find('.tf-tab').length).toBe(1);
        expect(wrapper.find('.tf-tab').text()).toMatch('tab 1');
    });
    it('switches tabs on click', () => {
        const surfaceList = [
            { name: 'surface 1', tab: 'tab 1' },
            { name: 'surface 2', tab: 'tab 2' },
        ];
        const wrapper = preact_render_spy_1.render(preact_1.h(visor_1.VisorComponent, { surfaceList: surfaceList }));
        expect(wrapper.find('.tf-tab').length).toBe(2);
        expect(wrapper.state().activeTab).toEqual('tab 2');
        // Clicks
        wrapper.find('.tf-tab').at(0).simulate('click');
        expect(wrapper.state().activeTab).toEqual('tab 1');
        expect(wrapper.find('.tf-tab').at(0).attr('data-isactive'))
            .toEqual(true);
        expect(wrapper.find('.tf-tab').at(1).attr('data-isactive'))
            .toEqual(false);
        expect(wrapper.find('.tf-surface').at(0).attr('data-visible'))
            .toEqual(true);
        expect(wrapper.find('.tf-surface').at(1).attr('data-visible'))
            .toEqual(false);
        wrapper.find('.tf-tab').at(1).simulate('click');
        expect(wrapper.state().activeTab).toEqual('tab 2');
        expect(wrapper.find('.tf-tab').at(0).attr('data-isactive'))
            .toEqual(false);
        expect(wrapper.find('.tf-tab').at(1).attr('data-isactive'))
            .toEqual(true);
        expect(wrapper.find('.tf-surface').at(0).attr('data-visible'))
            .toEqual(false);
        expect(wrapper.find('.tf-surface').at(1).attr('data-visible'))
            .toEqual(true);
    });
    it('hides on close button click', () => {
        const surfaceList = [];
        const wrapper = preact_render_spy_1.render(preact_1.h(visor_1.VisorComponent, { surfaceList: surfaceList }));
        expect(wrapper.state().isOpen).toEqual(true);
        const hideButton = wrapper.find('.visor-controls').children().at(1);
        expect(hideButton.text()).toEqual('Hide');
        hideButton.simulate('click');
        expect(wrapper.state().isOpen).toEqual(false);
    });
    it('maximises and minimizes', () => {
        const surfaceList = [];
        const wrapper = preact_render_spy_1.render(preact_1.h(visor_1.VisorComponent, { surfaceList: surfaceList }));
        expect(wrapper.state().isOpen).toEqual(true);
        let toggleButton;
        toggleButton = wrapper.find('.visor-controls').children().at(0);
        expect(toggleButton.text()).toEqual('Maximize');
        expect(wrapper.state().isFullscreen).toEqual(false);
        expect(wrapper.find('.visor').at(0).attr('data-isfullscreen'))
            .toEqual(false);
        toggleButton.simulate('click');
        toggleButton = wrapper.find('.visor-controls').children().at(0);
        expect(toggleButton.text()).toEqual('Minimize');
        expect(wrapper.state().isFullscreen).toEqual(true);
        expect(wrapper.find('.visor').at(0).attr('data-isfullscreen'))
            .toEqual(true);
    });
});
//# sourceMappingURL=visor_test.js.map