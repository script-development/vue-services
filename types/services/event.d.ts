import {Modal, ToastMessage, ToastVariant} from '../types';

export let defaultToastMessageDuration: number;

/**
 * Hide the toast message after a timeout and delete it from toastMessages
 * @param {ToastMessage} message
 */
export function hideToastMessage(message: ToastMessage): void;

/**
 * Hide the toast message after the given duration
 *
 * @param {ToastMessage} message the message to remove after the delay
 */
export function hideToastMessageAfterDelay(message: ToastMessage): void;

/**
 * Create a toast message
 *
 * @param {string} message the message to show
 * @param {ToastVariant} [variant] the variant of the toast, default = success
 * @param {number} [duration] the duration the toast stays visisble, default = defaultToastMessageDuration
 */
export function createToastMessage(message: string, variant?: ToastVariant, duration?: number): void;

/**
 *
 * @param {Modal} modal
 */
export function createModal(modal: Modal): void;
