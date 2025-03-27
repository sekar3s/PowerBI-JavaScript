// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { HttpPostMessage } from 'http-post-message';

/**
 * @hidden
 */
const allowedPowerBiHostsRegex =
  new RegExp(/(.+\.powerbi\.com$)|(.+\.fabric\.microsoft\.com$)|(.+\.analysis\.windows-int\.net$)|(.+\.analysis-df\.windows\.net$)/);

/**
 * @hidden
 */
const allowedPowerBiHostsSovRegex = new RegExp(/^app\.powerbi\.cn$|^app(\.mil\.|\.high\.|\.)powerbigov\.us$|^app\.powerbi\.eaglex\.ic\.gov$|^app\.powerbi\.microsoft\.scloud$/);

/**
 * @hidden
 */
const expectedEmbedUrlProtocol: string = "https:";

/**
 * Raises a custom event with event data on the specified HTML element.
 *
 * @export
 * @param {HTMLElement} element
 * @param {string} eventName
 * @param {*} eventData
 */
export function raiseCustomEvent(element: HTMLElement, eventName: string, eventData: any): void {
  let customEvent: CustomEvent;
  if (typeof CustomEvent === 'function') {
    customEvent = new CustomEvent(eventName, {
      detail: eventData,
      bubbles: true,
      cancelable: true
    });
  } else {
    customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent(eventName, true, true, eventData);
  }

  element.dispatchEvent(customEvent);
}

/**
 * Finds the index of the first value in an array that matches the specified predicate.
 *
 * @export
 * @template T
 * @param {(x: T) => boolean} predicate
 * @param {T[]} xs
 * @returns {number}
 */
export function findIndex<T>(predicate: (x: T) => boolean, xs: T[]): number {
  if (!Array.isArray(xs)) {
    throw new Error(`You attempted to call find with second parameter that was not an array. You passed: ${xs}`);
  }

  let index: number;
  xs.some((x, i) => {
    if (predicate(x)) {
      index = i;
      return true;
    }
  });

  return index;
}

/**
 * Finds the first value in an array that matches the specified predicate.
 *
 * @export
 * @template T
 * @param {(x: T) => boolean} predicate
 * @param {T[]} xs
 * @returns {T}
 */
export function find<T>(predicate: (x: T) => boolean, xs: T[]): T {
  const index = findIndex(predicate, xs);
  return xs[index];
}

export function remove<T>(predicate: (x: T) => boolean, xs: T[]): void {
  const index = findIndex(predicate, xs);
  xs.splice(index, 1);
}

// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
// TODO: replace in favor of using polyfill
/**
 * Copies the values of all enumerable properties from one or more source objects to a target object, and returns the target object.
 *
 * @export
 * @param {any} args
 * @returns
 */
export function assign(...args): any {
  var target = args[0];

  'use strict';
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source !== undefined && source !== null) {
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
}

/**
 * Generates a random 5 to 6 character string.
 *
 * @export
 * @returns {string}
 */
export function createRandomString(): string {
  return getRandomValue().toString(36).substring(1);
}

/**
 * Generates a 20 character uuid.
 *
 * @export
 * @returns {string}
 */
export function generateUUID(): string {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now();
  }
  return 'xxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (_c) {
    // Generate a random number, scaled from 0 to 15.
    const r = (getRandomValue() % 16);

    // Shift 4 times to divide by 16
    d >>= 4;
    return r.toString(16);
  });
}

/**
 * Adds a parameter to the given url
 *
 * @export
 * @param {string} url
 * @param {string} paramName
 * @param {string} value
 * @returns {string}
 */
export function addParamToUrl(url: string, paramName: string, value: string): string {
  const parameterPrefix = url.indexOf('?') > 0 ? '&' : '?';
  url += parameterPrefix + paramName + '=' + value;
  return url;
}

/**
 * Checks if the report is saved.
 *
 * @export
 * @param {HttpPostMessage} hpm
 * @param {string} uid
 * @param {Window} contentWindow
 * @returns {Promise<boolean>}
 */
export async function isSavedInternal(hpm: HttpPostMessage, uid: string, contentWindow: Window): Promise<boolean> {
  try {
    const response = await hpm.get<boolean>('/report/hasUnsavedChanges', { uid: uid }, contentWindow);
    return !response.body;
  } catch (response) {
    throw response.body;
  }
}

/**
 * Checks if the embed url is for RDL report.
 *
 * @export
 * @param {string} embedUrl
 * @returns {boolean}
 */
export function isRDLEmbed(embedUrl: string): boolean {
  return embedUrl && embedUrl.toLowerCase().indexOf("/rdlembed?") >= 0;
}

/**
 * Checks if the embed url contains autoAuth=true.
 *
 * @export
 * @param {string} embedUrl
 * @returns {boolean}
 */
export function autoAuthInEmbedUrl(embedUrl: string): boolean {
  return embedUrl && decodeURIComponent(embedUrl).toLowerCase().indexOf("autoauth=true") >= 0;
}

/**
 * Returns random number
 */
export function getRandomValue(): number {

  // window.msCrypto for IE
  const cryptoObj = window.crypto || (window as any).msCrypto;
  const randomValueArray = new Uint32Array(1);
  cryptoObj.getRandomValues(randomValueArray);

  return randomValueArray[0];
}

/**
 * Returns the time interval between two dates in milliseconds
 *
 * @export
 * @param {Date} start
 * @param {Date} end
 * @returns {number}
 */
export function getTimeDiffInMilliseconds(start: Date, end: Date): number {
  return Math.abs(start.getTime() - end.getTime());
}

/**
 * Checks if the embed type is for create
 *
 * @export
 * @param {string} embedType
 * @returns {boolean}
 */
export function isCreate(embedType: string): boolean {
  return embedType === 'create' || embedType === 'quickcreate';
}

/**
 * Checks if the embedUrl has an allowed power BI domain
 * @hidden
 */
export function validateEmbedUrl(embedUrl: string): boolean {
  if (embedUrl) {
    let url: URL;
    try {
      url = new URL(embedUrl.toLowerCase());
    } catch(e) {
      // invalid URL
      return false;
    }
    return url.protocol === expectedEmbedUrlProtocol &&
      (allowedPowerBiHostsRegex.test(url.hostname) || allowedPowerBiHostsSovRegex.test(url.hostname));
  }
}

/**
 * Calculates the percentage of a part relative to a total.
 * @param part - The part value.
 * @param total - The total value.
 * @returns The percentage as a number, or 0 if the total is 0.
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) {
      return 0;
  }
  return (part / total) * 100;
}