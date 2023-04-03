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
const glamor_1 = require("glamor");
/**
 * Renders a container for tab links
 */
class Tabs extends preact_1.Component {
    render() {
        const { tabNames, activeTab, handleClick } = this.props;
        const tabs = tabNames.length > 0 ?
            tabNames.map((name) => (preact_1.h(Tab, { key: name, id: name, handleClick: handleClick, isActive: name === activeTab }, name)))
            : null;
        const tabStyle = glamor_1.css({
            overflowX: 'scroll',
            overflowY: 'hidden',
            whiteSpace: 'nowrap',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderColor: '#eee',
            paddingBottom: '1rem',
            marginTop: '1rem',
        });
        return (preact_1.h("div", { className: `${tabStyle} visor-tabs` }, tabs));
    }
}
exports.Tabs = Tabs;
/**
 * A link representing a tab. Note that the component does not contain the
 * tab content
 */
class Tab extends preact_1.Component {
    render() {
        const { children, isActive, handleClick, id } = this.props;
        const tabStyle = glamor_1.css({
            borderBottomColor: isActive ? '#357EDD' : '#AAAAAA',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            cursor: 'pointer',
            ':hover': {
                color: '#357EDD'
            },
            display: 'inline-block',
            marginRight: '1rem',
            padding: '.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
        });
        return (preact_1.h("a", { className: `${tabStyle} tf-tab`, "data-isactive": isActive, onClick: () => handleClick(id) }, children));
    }
}
//# sourceMappingURL=tabs.js.map