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
const surface_1 = require("./surface");
const tabs_1 = require("./tabs");
/**
 * The Visor is a component that displays and manages 'Tabs' and 'Surfaces'.
 *
 * It is meant to exist as a singleton component on a given page and is thus
 * accessed by a visor() function that exposes a single instance of this
 * component via an imperative API (i.e. its implementation as a (p)react
 * component is an internal implementation detail.
 *
 * Following that, and somewhat unlike a typical react component, it does allow
 * for imperative calls to that instance to modify internal state. Any state
 * that needs to be serialized or persisted should be lifted to props.
 */
class VisorComponent extends preact_1.Component {
    /**
     * Helper function to render the component to the DOM.
     *
     * Note that although the visor has a parent element, it rendered via absolute
     * positioning and is thus taken out of regular document flow.
     *
     * @param parent A DOM element
     * @param replaceNode The element that re-rendering this component would
     *                    replace. Usually null initially and will be returned by
     *                    this function after the first render.
     * @param props Initial visor props
     */
    static render(parent, replaceNode, props) {
        return preact_1.render(preact_1.h(VisorComponent, Object.assign({}, props)), parent, replaceNode);
    }
    constructor(props) {
        super(props);
        this.surfaces = new Map();
        const startOpen = props.startOpen == null ? true : props.startOpen;
        this.state = {
            isOpen: startOpen,
            isFullscreen: false,
            activeTab: null,
            tabs: new Set()
        };
        this.keyHandler = this.keyHandler.bind(this);
    }
    // These public methods are exposed via an imperative interface
    close() {
        this.setState({ isOpen: false });
    }
    open() {
        this.setState({ isOpen: true });
    }
    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }
    toggleFullScreen() {
        this.setState({ isFullscreen: !this.state.isFullscreen });
    }
    isOpen() {
        return this.state.isOpen;
    }
    isFullscreen() {
        return this.state.isFullscreen;
    }
    getSurface(label, tab) {
        const surfaceId = this.surfaceId(label, tab);
        let surface;
        if (this.surfaces.has(surfaceId)) {
            surface = this.surfaces.get(surfaceId);
        }
        else {
            throw Error(`Surface not found with id: ${surfaceId}`);
        }
        return {
            container: surface.container,
            label: surface.label,
            drawArea: surface.drawArea,
        };
    }
    bindKeys() {
        document.addEventListener('keydown', this.keyHandler, false);
    }
    unbindKeys() {
        document.removeEventListener('keydown', this.keyHandler);
    }
    surfaceId(label, tab) {
        return label + tab;
    }
    setTabs(surfaceList) {
        // Check if we have new tabs
        const nextTabs = surfaceList.map(s => s.tab);
        const tabs = this.state.tabs;
        let newActiveTab;
        for (const tab of nextTabs) {
            if (!tabs.has(tab)) {
                tabs.add(tab);
                newActiveTab = tab;
            }
        }
        if (newActiveTab != null) {
            this.setState({
                tabs,
                activeTab: newActiveTab,
            });
        }
    }
    getTabs() {
        return this.state.tabs;
    }
    // Event Handlers
    registerSurface(name, tab, surface) {
        const surfaceId = this.surfaceId(name, tab);
        this.surfaces.set(surfaceId, surface);
    }
    keyHandler(event) {
        const BACKTICK_KEY = 192;
        if (event.keyCode === BACKTICK_KEY) {
            if (event.shiftKey) {
                this.toggleFullScreen();
            }
            else {
                this.toggle();
            }
        }
    }
    setActiveTab(tab) {
        this.setState({ activeTab: tab });
    }
    // Lifecycle Methods
    componentDidMount() {
        this.bindKeys();
    }
    componentWillMount() {
        this.setTabs(this.props.surfaceList);
    }
    componentWillReceiveProps(nextProps) {
        this.setTabs(nextProps.surfaceList);
    }
    render() {
        const { isOpen, isFullscreen, activeTab } = this.state;
        const { surfaceList } = this.props;
        const tabNames = Array.from(this.getTabs().values());
        const SMALL_WIDTH = '550px';
        const LARGE_WIDTH = '90vw';
        const width = isFullscreen ? LARGE_WIDTH : SMALL_WIDTH;
        const defaultStyles = glamor_1.css({
            width,
            height: '100%',
            backgroundColor: '#fafafa',
            boxSizing: 'border-box',
            padding: '10px',
            position: 'fixed',
            top: '0px',
            // tslint:disable-next-line
            transition: `right 0.5s cubic-bezier(0.645, 0.045, 0.355, 1), width 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)`,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.12), 0 2px 5px rgba(0, 0, 0, 0.24)',
            overflow: 'auto',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            zIndex: 1000,
        });
        const openStyle = glamor_1.css({ right: '0' });
        const closedStyle = glamor_1.css({ right: `calc(-${width} - 10px)` });
        const position = isOpen ? openStyle : closedStyle;
        // TODO. Add flex wrapping for surfaces
        const surfacesContainerStyle = glamor_1.css({});
        return (preact_1.h("div", { className: `${defaultStyles} ${position} visor`, "data-isopen": isOpen, "data-isfullscreen": isFullscreen },
            preact_1.h(VisorControls, { fullScreenHandler: this.toggleFullScreen.bind(this), closeHandler: this.close.bind(this), isFullScreen: isFullscreen }),
            preact_1.h(tabs_1.Tabs, { tabNames: tabNames, activeTab: activeTab, handleClick: this.setActiveTab.bind(this) }),
            preact_1.h("div", { className: `${surfacesContainerStyle} visor-surfaces` }, surfaceList.map((surfaceInfo) => (preact_1.h(surface_1.SurfaceComponent, { key: surfaceInfo.name + surfaceInfo.tab, name: surfaceInfo.name, tab: surfaceInfo.tab, styles: surfaceInfo.styles, registerSurface: this.registerSurface.bind(this), visible: activeTab === surfaceInfo.tab }))))));
    }
}
exports.VisorComponent = VisorComponent;
function VisorControls(props) {
    const { isFullScreen, fullScreenHandler, closeHandler } = props;
    const toolBarStyle = glamor_1.css({
        display: 'flex',
        backgroundColor: 'white',
        border: '1px solid white',
        padding: '6px',
        paddingTop: '10px',
        marginBottom: '10px',
        borderRadius: '6px',
        marginTop: '-16px'
    });
    const controlsButtonClass = glamor_1.css({
        fontSize: '.875rem',
        borderRadius: '.25rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '.5rem',
        paddingBottom: '.5rem',
        textDecoration: 'none',
        transition: 'color .15s ease-in',
        color: '#111',
    });
    const floatRight = glamor_1.css({
        marginLeft: 'auto',
    });
    return (preact_1.h("div", { className: `${toolBarStyle} visor-controls` },
        preact_1.h("button", { className: `${controlsButtonClass}`, onClick: fullScreenHandler }, isFullScreen ? 'Minimize' : 'Maximize'),
        preact_1.h("button", { className: `${controlsButtonClass} ${floatRight}`, onClick: closeHandler }, "Hide")));
}
//# sourceMappingURL=visor.js.map