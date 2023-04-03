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
import { SurfaceInfoStrict, StyleOptions } from '../types';
interface SurfaceProps extends SurfaceInfoStrict {
    visible: boolean;
    registerSurface: (name: string, tab: string, surface: SurfaceComponent) => void;
}
/**
 * A surface is container for visualizations and other rendered thigns.
 * It consists of a containing DOM Element, a label and an empty drawArea.
 */
export declare class SurfaceComponent extends Component<SurfaceProps> {
    static defaultStyles: Partial<StyleOptions>;
    container: HTMLElement;
    label: HTMLElement;
    drawArea: HTMLElement;
    componentDidMount(): void;
    componentDidUpdate(): boolean;
    render(): JSX.Element;
}
export {};
