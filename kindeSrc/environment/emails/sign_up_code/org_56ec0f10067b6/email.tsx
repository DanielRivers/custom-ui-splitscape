import SignUpCodeEmail from "../email";
import { organizationVariant } from "../../_shared/organizationVariant";
import type { KindeEmailEvent, KindeEmailRenderResult, KindeEmailSettings } from "../../_shared/types";

// sign_up_code for organization org_56ec0f10067b6 only. Same wording as the
// environment template, with the organization look.

export const emailSettings: KindeEmailSettings = {
  orgCode: "org_56ec0f10067b6",
  bindings: {},
};

export default async function OrganizationSignUpCodeEmail(
  input: KindeEmailEvent | { event: KindeEmailEvent },
): Promise<KindeEmailRenderResult> {
  return SignUpCodeEmail(input, organizationVariant);
}
