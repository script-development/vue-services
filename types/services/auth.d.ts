import {AxiosResponse} from 'axios';
import {Component} from 'vue';
import {NavigationGuard} from 'vue-router';
import {IsLoggedIn, LoggedInUser, LoginCredentials, ResetPasswordData, ResponseErrorMiddleware} from '../types';

export function setResetPasswordPage(page: Component): void;
export function setLoginPage(page: Component): void;
export function setForgotPasswordPage(page: Component): void;
export function setSetPasswordPage(page: Component): void;

/**
 * Set the default logged in page name
 * @param {string} name
 */
export function setDefaultLoggedInPageName(name: string): void;

export function goToLoginPage(): void;
export function goToResetPasswordPage(): void;
export function goToForgotPasswordPage(): void;
export function goToSetPasswordPage(): void;

export const isLoggedIn: IsLoggedIn;
export const loggedInUser: LoggedInUser;

export const responseErrorMiddleware: ResponseErrorMiddleware;
export const beforeMiddleware: NavigationGuard;

export async function login(credentials: LoginCredentials): AxiosResponse;
export async function logout(): AxiosResponse;
export async function checkIfLoggedIn(): AxiosResponse;

export async function sendResetPasswordEmail(email: string): AxiosResponse;
export async function sendResetPasswordEmail(data: ResetPasswordData): AxiosResponse;

export function setAuthRoutes(): void;