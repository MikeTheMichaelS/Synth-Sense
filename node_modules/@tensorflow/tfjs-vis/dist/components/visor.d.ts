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
import { Component } from 'preact';
import { SurfaceInfoStrict } from '../types';
interface VisorProps {
    surfaceList: SurfaceInfoStrict[];
    startOpen?: boolean;
    ref?: (r: VisorComponent) => void;
}
interface VisorState {
    isOpen: boolean;
    isFullscreen: boolean;
    activeTab: string | null;
    tabs: Set<string>;
}
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
export declare class VisorComponent extends Component<VisorProps, VisorState> {
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
    static render(parent: Element, replaceNode: Element, props: VisorProps): Element;
    private surfaces;
    constructor(props: VisorProps);
    close(): void;
    open(): void;
    toggle(): void;
    toggleFullScreen(): void;
    isOpen(): boolean;
    isFullscreen(): boolean;
    getSurface(label: string, tab: string): {
        container: HTMLElement;
        label: HTMLElement;
        drawArea: HTMLElement;
    };
    bindKeys(): void;
    unbindKeys(): void;
    private surfaceId;
    private setTabs;
    private getTabs;
    private registerSurface;
    private keyHandler;
    private setActiveTab;
    componentDidMount(): void;
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: VisorProps): void;
    render(): JSX.Element;
}
export {};
