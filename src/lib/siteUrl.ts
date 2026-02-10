/**
 * Base URL used for auth email links (signup confirmation, password reset).
 * Set VITE_SITE_URL in .env (e.g. https://astarus.ai) so emails never point to localhost.
 * If unset, defaults to production URL so links in emails are never localhost.
 */
const raw = import.meta.env.VITE_SITE_URL?.trim();
export const siteUrl = raw && raw.length > 0 ? raw.replace(/\/$/, '') : 'https://astarus.ai';

export const authCallbackUrl = `${siteUrl}/auth/callback`;
