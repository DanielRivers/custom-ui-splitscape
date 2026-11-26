// Types for Kinde custom email templates.
//
// These mirror the email template contract Kinde publishes for
// `kindeSrc/environment/emails/<key>/email.tsx`. They live here because
// `@kinde/infrastructure` does not export email types yet.

export type KindeEmailKey =
  | "sign_up_code"
  | "password_reset"
  | "mfa_code"
  | "organization_invitation";

export interface KindeEmailSettings {
  /** Present only on a per-organization variant (needs the advanced organizations entitlement). */
  orgCode?: string;
  /** Languages this template renders. Omit to render every language. */
  locales?: string[];
  /** Runtime bindings. `kinde.*` bindings are always removed for email templates. */
  bindings?: Record<string, {}>;
}

export interface KindeEmailEvent {
  request: {
    email: {
      key: KindeEmailKey;
      to: string;
      /** Code emails only. */
      code?: string;
      expiresInMinutes?: number;
      /** Organization invitation only. */
      link?: string;
      recipient: {
        firstName?: string;
      };
      sender: {
        fromName?: string;
        fromEmail?: string;
      };
      /** The editable copy from the Email content page, in the request language. */
      translations?: Record<string, string>;
    };
    locale: {
      lang: string;
    };
  };
  context: {
    domains: {
      kindeDomain: string;
    };
    organization?: {
      code: string;
      name: string;
      logoUrl: string;
    };
    application?: {
      clientId?: string;
      name?: string;
    };
    branding: {
      businessName: string;
      logoUrl: string;
      primaryButtonColor?: string;
      primaryButtonTextColor?: string;
      linkColor?: string;
    };
  };
}

/** What the default export of an email template must resolve to. All three are required. */
export interface KindeEmailRenderResult {
  subject: string;
  html: string;
  text: string;
}
