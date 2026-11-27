import OrganizationInvitationEmail from "../email";
import { organizationVariant } from "../../_shared/organizationVariant";
import type { KindeEmailEvent, KindeEmailRenderResult, KindeEmailSettings } from "../../_shared/types";

// organization_invitation for organization org_0680611efdb only. Same wording
// as the environment template, with the organization look.

export const emailSettings: KindeEmailSettings = {
  orgCode: "org_0680611efdb",
  bindings: {},
};

export default async function OrganizationSpecificInvitationEmail(
  input: KindeEmailEvent | { event: KindeEmailEvent },
): Promise<KindeEmailRenderResult> {
  return OrganizationInvitationEmail(input, organizationVariant);
}
