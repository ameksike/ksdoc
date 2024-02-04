/**
 * @description string interpolation
 * @param {String} str
 * @param {Object} data
 * @param {String} open
 * @param {String} close
 * @returns {String} string
 */
export function mix(str: string, data: any, open?: string, close?: string): string;
/**
 * @description read objects from file
 * @param {String} file
 * @param {String} [type]
 * @param {String} [encoding]
 * @returns {Promise<Object>}
 */
export function fileRead(file: string, type?: string, encoding?: string): Promise<any>;
/**
 * @description get file extension
 * @param {String} filename
 * @returns {String} extension
 */
export function fileExtension(filename: string): string;
