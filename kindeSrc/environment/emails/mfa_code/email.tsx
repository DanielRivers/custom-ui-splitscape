import { codeEmailValues, renderCodeEmail } from "../_shared/codeEmail";
import { greeting, translate } from "../_shared/copy";
import { resolveEvent } from "../_shared/layout";
import type { KindeEmailEvent, KindeEmailRenderResult, KindeEmailSettings } from "../_shared/types";

// Sent with the one-time code for email multi-factor authentication.
//
// Kinde's editable copy is written for email verification, so only its
// disclaimer is used here; the rest of the wording is specific to MFA.

export const emailSettings: KindeEmailSettings = {
  bindings: {},
};

export default async function MfaCodeEmail(
  input: KindeEmailEvent | { event: KindeEmailEvent },
): Promise<KindeEmailRenderResult> {
  const event = resolveEvent(input);
  const values = codeEmailValues(event);
  const { business, code, expiresIn } = values;

  return renderCodeEmail(event, values, {
    subject: `Your ${business} sign-in code`,
    preview: `Enter this code to finish signing in to ${business}`,
    heading: "Finish signing in",
    body: `${greeting(event)}\nEnter the code below to finish signing in to ${business}. This code expires in ${expiresIn}.`,
    note: "If you didn't try to sign in, someone else may know your password. We recommend changing it.",
    disclaimer: translate(
      event,
      "email_disclaimer",
      `You received this email because a sign-in code was requested for ${business}`,
      { business_name: business, code, expiration_duration: expiresIn },
    ),
  });
}
