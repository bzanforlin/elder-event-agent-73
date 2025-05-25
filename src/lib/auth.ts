import { Client, request, settings } from "./auth-api";
import { getCSRFToken } from "./django";

export const AuthProcess = Object.freeze({
  LOGIN: "login",
  CONNECT: "connect",
});

export const Flows = Object.freeze({
  VERIFY_EMAIL: "verify_email",
  LOGIN: "login",
  LOGIN_BY_CODE: "login_by_code",
  SIGNUP: "signup",
  PROVIDER_REDIRECT: "provider_redirect",
  PROVIDER_SIGNUP: "provider_signup",
  MFA_AUTHENTICATE: "mfa_authenticate",
  REAUTHENTICATE: "reauthenticate",
  MFA_REAUTHENTICATE: "mfa_reauthenticate",
  MFA_WEBAUTHN_SIGNUP: "mfa_signup_webauthn",
});

export const AuthenticatorType = Object.freeze({
  TOTP: "totp",
  RECOVERY_CODES: "recovery_codes",
  WEBAUTHN: "webauthn",
});

export const URLs = Object.freeze({
  // Meta
  CONFIG: `/_allauth/${Client.BROWSER}/v1/config`,

  // Account management
  CHANGE_PASSWORD: `/_allauth/${Client.BROWSER}/v1/account/password/change`,
  EMAIL: `/_allauth/${Client.BROWSER}/v1/account/email`,
  PROVIDERS: `/_allauth/${Client.BROWSER}/v1/account/providers`,

  // Account management: 2FA
  AUTHENTICATORS: `/_allauth/${Client.BROWSER}/v1/account/authenticators`,
  RECOVERY_CODES: `/_allauth/${Client.BROWSER}/v1/account/authenticators/recovery-codes`,
  TOTP_AUTHENTICATOR: `/_allauth/${Client.BROWSER}/v1/account/authenticators/totp`,

  // Auth: Basics
  LOGIN: `/_allauth/${Client.BROWSER}/v1/auth/login`,
  REQUEST_LOGIN_CODE: `/_allauth/${Client.BROWSER}/v1/auth/code/request`,
  CONFIRM_LOGIN_CODE: `/_allauth/${Client.BROWSER}/v1/auth/code/confirm`,
  SESSION: `/_allauth/${Client.BROWSER}/v1/auth/session`,
  REAUTHENTICATE: `/_allauth/${Client.BROWSER}/v1/auth/reauthenticate`,
  REQUEST_PASSWORD_RESET: `/_allauth/${Client.BROWSER}/v1/auth/password/request`,
  RESET_PASSWORD: `/_allauth/${Client.BROWSER}/v1/auth/password/reset`,
  SIGNUP: `/_allauth/${Client.BROWSER}/v1/auth/signup`,
  VERIFY_EMAIL: `/_allauth/${Client.BROWSER}/v1/auth/email/verify`,

  // Auth: 2FA
  MFA_AUTHENTICATE: `/_allauth/${Client.BROWSER}/v1/auth/2fa/authenticate`,
  MFA_REAUTHENTICATE: `/_allauth/${Client.BROWSER}/v1/auth/2fa/reauthenticate`,

  // Auth: Social
  PROVIDER_SIGNUP: `/_allauth/${Client.BROWSER}/v1/auth/provider/signup`,
  REDIRECT_TO_PROVIDER: `/_allauth/${Client.BROWSER}/v1/auth/provider/redirect`,
  PROVIDER_TOKEN: `/_allauth/${Client.BROWSER}/v1/auth/provider/token`,

  // Auth: Sessions
  SESSIONS: `/_allauth/${Client.BROWSER}/v1/auth/sessions`,

  // Auth: WebAuthn
  REAUTHENTICATE_WEBAUTHN: `/_allauth/${Client.BROWSER}/v1/auth/webauthn/reauthenticate`,
  AUTHENTICATE_WEBAUTHN: `/_allauth/${Client.BROWSER}/v1/auth/webauthn/authenticate`,
  LOGIN_WEBAUTHN: `/_allauth/${Client.BROWSER}/v1/auth/webauthn/login`,
  SIGNUP_WEBAUTHN: `/_allauth/${Client.BROWSER}/v1/auth/webauthn/signup`,
  WEBAUTHN_AUTHENTICATOR: `/_allauth/${Client.BROWSER}/v1/account/authenticators/webauthn`,
});

// All the auth-related functions
export async function login(data) {
  return await request("POST", URLs.LOGIN, data);
}

export async function reauthenticate(data) {
  return await request("POST", URLs.REAUTHENTICATE, data);
}

export async function logout() {
  return await request("DELETE", URLs.SESSION);
}

export async function signUp(data) {
  return await request("POST", URLs.SIGNUP, data);
}

export async function signUpByPasskey(data) {
  return await request("POST", URLs.SIGNUP_WEBAUTHN, data);
}

export async function providerSignup(data) {
  return await request("POST", URLs.PROVIDER_SIGNUP, data);
}

export async function getProviderAccounts() {
  return await request("GET", URLs.PROVIDERS);
}

export async function disconnectProviderAccount(providerId, accountUid) {
  return await request("DELETE", URLs.PROVIDERS, {
    provider: providerId,
    account: accountUid,
  });
}

export async function requestPasswordReset(email) {
  return await request("POST", URLs.REQUEST_PASSWORD_RESET, { email });
}

export async function requestLoginCode(email) {
  return await request("POST", URLs.REQUEST_LOGIN_CODE, { email });
}

export async function confirmLoginCode(code) {
  return await request("POST", URLs.CONFIRM_LOGIN_CODE, { code });
}

export async function getEmailVerification(key) {
  return await request("GET", URLs.VERIFY_EMAIL, undefined, {
    "X-Email-Verification-Key": key,
  });
}

export async function getEmailAddresses() {
  return await request("GET", URLs.EMAIL);
}
export async function getSessions() {
  return await request("GET", URLs.SESSIONS);
}

export async function endSessions(ids) {
  return await request("DELETE", URLs.SESSIONS, { sessions: ids });
}

export async function getAuthenticators() {
  return await request("GET", URLs.AUTHENTICATORS);
}

export async function getTOTPAuthenticator() {
  return await request("GET", URLs.TOTP_AUTHENTICATOR);
}

export async function mfaAuthenticate(code) {
  return await request("POST", URLs.MFA_AUTHENTICATE, { code });
}

export async function mfaReauthenticate(code) {
  return await request("POST", URLs.MFA_REAUTHENTICATE, { code });
}

export async function activateTOTPAuthenticator(code) {
  return await request("POST", URLs.TOTP_AUTHENTICATOR, { code });
}

export async function deactivateTOTPAuthenticator() {
  return await request("DELETE", URLs.TOTP_AUTHENTICATOR);
}

export async function getRecoveryCodes() {
  return await request("GET", URLs.RECOVERY_CODES);
}

export async function generateRecoveryCodes() {
  return await request("POST", URLs.RECOVERY_CODES);
}

export async function getConfig() {
  return await request("GET", URLs.CONFIG);
}

export async function addEmail(email) {
  return await request("POST", URLs.EMAIL, { email });
}

export async function deleteEmail(email) {
  return await request("DELETE", URLs.EMAIL, { email });
}

export async function markEmailAsPrimary(email) {
  return await request("PATCH", URLs.EMAIL, { email, primary: true });
}

export async function requestEmailVerification(email) {
  return await request("PUT", URLs.EMAIL, { email });
}

export async function verifyEmail(key) {
  return await request("POST", URLs.VERIFY_EMAIL, { key });
}

export async function getPasswordReset(key) {
  return await request("GET", URLs.RESET_PASSWORD, undefined, {
    "X-Password-Reset-Key": key,
  });
}

export async function resetPassword(data) {
  return await request("POST", URLs.RESET_PASSWORD, data);
}

export async function changePassword(data) {
  return await request("POST", URLs.CHANGE_PASSWORD, data);
}

export async function getAuth() {
  return await request("GET", URLs.SESSION);
}

export async function authenticateByToken(
  providerId,
  token,
  process = AuthProcess.LOGIN
) {
  return await request("POST", URLs.PROVIDER_TOKEN, {
    provider: providerId,
    token,
    process,
  });
}

export function redirectToProvider(
  providerId,
  callbackURL,
  process = AuthProcess.LOGIN
) {
  postForm(URLs.REDIRECT_TO_PROVIDER, {
    provider: providerId,
    process,
    callback_url:
      window.location.protocol + "//" + window.location.host + callbackURL,
    csrfmiddlewaretoken: getCSRFToken(),
  });
}

export async function getWebAuthnCreateOptions(passwordless) {
  let url = URLs.WEBAUTHN_AUTHENTICATOR;
  if (passwordless) {
    url += "?passwordless";
  }
  return await request("GET", url);
}

export async function getWebAuthnCreateOptionsAtSignup() {
  return await request("GET", URLs.SIGNUP_WEBAUTHN);
}

export async function addWebAuthnCredential(name, credential) {
  return await request("POST", URLs.WEBAUTHN_AUTHENTICATOR, {
    name,
    credential,
  });
}

export async function signupWebAuthnCredential(name, credential) {
  return await request("PUT", URLs.SIGNUP_WEBAUTHN, {
    name,
    credential,
  });
}

export async function deleteWebAuthnCredential(ids) {
  return await request("DELETE", URLs.WEBAUTHN_AUTHENTICATOR, {
    authenticators: ids,
  });
}

export async function updateWebAuthnCredential(id, data) {
  return await request("PUT", URLs.WEBAUTHN_AUTHENTICATOR, { id, ...data });
}

export async function getWebAuthnRequestOptionsForReauthentication() {
  return await request("GET", URLs.REAUTHENTICATE_WEBAUTHN);
}

export async function reauthenticateUsingWebAuthn(credential) {
  return await request("POST", URLs.REAUTHENTICATE_WEBAUTHN, { credential });
}

export async function authenticateUsingWebAuthn(credential) {
  return await request("POST", URLs.AUTHENTICATE_WEBAUTHN, { credential });
}

export async function loginUsingWebAuthn(credential) {
  return await request("POST", URLs.LOGIN_WEBAUTHN, { credential });
}

export async function getWebAuthnRequestOptionsForLogin() {
  return await request("GET", URLs.LOGIN_WEBAUTHN);
}

export async function getWebAuthnRequestOptionsForAuthentication() {
  return await request("GET", URLs.AUTHENTICATE_WEBAUTHN);
}

export function setup(client, withCredentials) {
  settings.client = client;
  settings.withCredentials = withCredentials;
}

function postForm(action, data) {
  const f = document.createElement("form");
  f.method = "POST";
  f.action = action;

  for (const key in data) {
    const d = document.createElement("input");
    d.type = "hidden";
    d.name = key;
    d.value = data[key];
    f.appendChild(d);
  }
  document.body.appendChild(f);
  f.submit();
}
