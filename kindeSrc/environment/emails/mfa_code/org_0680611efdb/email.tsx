import MfaCodeEmail from "../email";
import { organizationVariant } from "../../_shared/organizationVariant";
import type { KindeEmailEvent, KindeEmailRenderResult, KindeEmailSettings } from "../../_shared/types";

// mfa_code for organization org_0680611efdb only. Same wording as the
// environment template, with the organization look.

export const emailSettings: KindeEmailSettings = {
  orgCode: "org_0680611efdb",
  bindings: {},
};

export default async function OrganizationMfaCodeEmail(
  input: KindeEmailEvent | { event: KindeEmailEvent },
): Promise<KindeEmailRenderResult> {
  return MfaCodeEmail(input, organizationVariant);
}
