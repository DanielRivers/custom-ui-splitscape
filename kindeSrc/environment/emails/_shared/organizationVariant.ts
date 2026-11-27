import type { EmailVariant } from "./layout";

// The look of the per-organization templates (emails/<key>/org_56ec0f10067b6/).
// They keep the environment wording and change only the brand panel: dark
// instead of the brand colour, with a badge, so it is obvious at a glance
// which template rendered an email.
export const organizationVariant: EmailVariant = {
  panelColor: "#111827",
  panelTextColor: "#FFFFFF",
  badge: "Organization template",
};
