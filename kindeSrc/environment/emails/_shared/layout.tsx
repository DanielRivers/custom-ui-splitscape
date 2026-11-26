import React from "react";
import { renderToString } from "react-dom/server.browser";
import { palette, paragraphs, plain, safeColor, safeUrl, senderName } from "./copy";
import type { KindeEmailEvent } from "./types";

// The shared SplitScape email layout. Email clients ignore <style> blocks and
// external CSS more often than not, so everything is a table with inline
// styles. The brand panel at the top echoes the split-screen side panel of the
// sign-in pages.
//
// This folder holds no email.tsx, so Kinde's Git sync never treats it as a
// template: it only discovers files named email.{js,ts,tsx,jsx}.

const RTL_LANGUAGES = ["ar", "fa", "he", "ur", "ps", "sd", "yi"];

export type EmailTheme = {
  button: string;
  buttonText: string;
  link: string;
};

/** Branding colours from the event, falling back to the repo palette. */
export const themeFor = (event: KindeEmailEvent): EmailTheme => {
  const { branding } = event.context;
  return {
    button: safeColor(branding.primaryButtonColor, palette.primary),
    buttonText: safeColor(branding.primaryButtonTextColor, palette.primaryText),
    link: safeColor(branding.linkColor, palette.link),
  };
};

/**
 * Kinde calls the default export with the event itself. Accepting a
 * `{ event }` wrapper as well keeps a template working if it is ever called
 * that way.
 */
export const resolveEvent = (input: KindeEmailEvent | { event: KindeEmailEvent }): KindeEmailEvent =>
  "event" in input && input.event?.request ? input.event : (input as KindeEmailEvent);

const text: React.CSSProperties = {
  fontFamily: palette.fontFamily,
  fontSize: "16px",
  lineHeight: "24px",
  color: palette.text,
  margin: "0 0 16px",
};

export const Paragraphs = ({ copy }: { copy: string }) => (
  <>
    {paragraphs(copy).map((line, index) => (
      <p key={index} style={text}>
        {line}
      </p>
    ))}
  </>
);

export const CodeBlock = ({ code }: { code: string }) => (
  <table role="presentation" cellPadding={0} cellSpacing={0} border={0} style={{ margin: "8px 0 24px" }}>
    <tbody>
      <tr>
        <td
          style={{
            backgroundColor: palette.canvas,
            border: `1px solid ${palette.border}`,
            borderRadius: "12px",
            padding: "16px 28px",
            fontFamily: palette.codeFontFamily,
            fontSize: "32px",
            fontWeight: 600,
            letterSpacing: "8px",
            lineHeight: "40px",
            color: palette.heading,
          }}
        >
          {code}
        </td>
      </tr>
    </tbody>
  </table>
);

export const Button = ({ href, label, theme }: { href: string; label: string; theme: EmailTheme }) => (
  <table role="presentation" cellPadding={0} cellSpacing={0} border={0} style={{ margin: "8px 0 24px" }}>
    <tbody>
      <tr>
        <td style={{ backgroundColor: theme.button, borderRadius: "99px" }}>
          <a
            href={href}
            target="_blank"
            rel="noopener"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: "99px",
              fontFamily: palette.fontFamily,
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "20px",
              color: theme.buttonText,
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        </td>
      </tr>
    </tbody>
  </table>
);

export const Muted = ({ children }: { children: React.ReactNode }) => (
  <p
    style={{
      fontFamily: palette.fontFamily,
      fontSize: "14px",
      lineHeight: "20px",
      color: palette.muted,
      margin: "0 0 12px",
    }}
  >
    {children}
  </p>
);

const BrandPanel = ({ event, theme }: { event: KindeEmailEvent; theme: EmailTheme }) => {
  const name = senderName(event);
  const logoUrl = safeUrl(event.context.organization?.logoUrl) ?? safeUrl(event.context.branding.logoUrl);

  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      border={0}
      style={{ backgroundColor: theme.button, borderRadius: "12px" }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "28px 32px" }}>
            {logoUrl ? (
              <table role="presentation" cellPadding={0} cellSpacing={0} border={0}>
                <tbody>
                  <tr>
                    <td style={{ backgroundColor: palette.surface, borderRadius: "99px", padding: "8px 16px" }}>
                      <img
                        src={logoUrl}
                        alt={name}
                        height={32}
                        style={{ display: "block", height: "32px", width: "auto", maxWidth: "160px", border: 0 }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <span
                style={{
                  fontFamily: palette.fontFamily,
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: "28px",
                  color: theme.buttonText,
                }}
              >
                {name}
              </span>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export type EmailLayoutProps = {
  event: KindeEmailEvent;
  subject: string;
  /** Inbox preview line, hidden in the body. */
  preview?: string;
  heading: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const EmailLayout = ({ event, subject, preview, heading, children, footer }: EmailLayoutProps) => {
  const theme = themeFor(event);
  const lang = plain(event.request.locale?.lang).trim() || "en";
  const dir = RTL_LANGUAGES.includes(lang.split("-")[0].toLowerCase()) ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="light" name="color-scheme" />
        <meta content="light" name="supported-color-schemes" />
        <title>{subject}</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: palette.canvas }}>
        {preview ? (
          <div
            style={{
              display: "none",
              maxHeight: 0,
              overflow: "hidden",
              opacity: 0,
              fontSize: "1px",
              lineHeight: "1px",
              color: palette.canvas,
            }}
          >
            {preview}
          </div>
        ) : null}
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          border={0}
          style={{ backgroundColor: palette.canvas }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "32px 16px" }}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  border={0}
                  style={{
                    maxWidth: "560px",
                    backgroundColor: palette.surface,
                    border: `1px solid ${palette.border}`,
                    borderRadius: "16px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px" }}>
                        <BrandPanel event={event} theme={theme} />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "32px 40px 8px", textAlign: dir === "rtl" ? "right" : "left" }}>
                        <h1
                          style={{
                            fontFamily: palette.fontFamily,
                            fontSize: "26px",
                            fontWeight: 600,
                            lineHeight: "32px",
                            color: palette.heading,
                            margin: "0 0 20px",
                          }}
                        >
                          {heading}
                        </h1>
                        {children}
                      </td>
                    </tr>
                    {footer ? (
                      <tr>
                        <td style={{ padding: "0 40px 28px", textAlign: dir === "rtl" ? "right" : "left" }}>
                          <div style={{ borderTop: `1px solid ${palette.border}`, height: "1px", margin: "0 0 20px" }} />
                          {footer}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
                <p
                  style={{
                    fontFamily: palette.fontFamily,
                    fontSize: "12px",
                    lineHeight: "18px",
                    color: palette.muted,
                    margin: "16px 0 0",
                  }}
                >
                  Sent by {senderName(event)}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};

/** Renders a layout to a complete HTML document. */
export const renderEmail = (element: React.ReactElement): string =>
  `<!DOCTYPE html>${renderToString(element)}`;

/** Assembles the plain-text body from the same copy as the HTML body. */
export const plainText = (sections: Array<string | undefined | false>): string =>
  sections
    .filter((section): section is string => typeof section === "string" && section.trim() !== "")
    .map((section) => plain(section).trim())
    .join("\n\n") + "\n";
