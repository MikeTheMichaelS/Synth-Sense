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
import { Drawable } from '../types';
/**
 * Utility function to create/retrieve divs within an HTMLElement|Surface
 */
export declare function subSurface(parent: Drawable, name: string, opts?: Options): HTMLElement;
export declare function getDefaultWidth(element: HTMLElement): number;
export declare function getDefaultHeight(element: HTMLElement): number;
interface Options {
    prepend?: boolean;
    title?: string;
}
export {};
