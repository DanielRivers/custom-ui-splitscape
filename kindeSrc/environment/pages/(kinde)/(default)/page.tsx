"use server";

import { Widget } from "../../../../components/widget";
import { DefaultLayout } from "../../../../layouts/default";
import { Root } from "../../../../root";
import { type KindePageEvent } from "@kinde/infrastructure";
import React from "react";
import { renderToString } from "react-dom/server.browser";

const DefaultPage: React.FC<KindePageEvent> = ({ context, request }) => {
  const handleButtonClick = () => {
    console.log("Button clicked");
  };

  return (
    <Root context={context} request={request}>
      <DefaultLayout>
        <Widget
          heading={context.widget.content.heading}
          description={context.widget.content.description}
          onButtonClick={handleButtonClick}
        />
        <button
          type="button"
          data-kinde-change-connection-button="true"
          data-kinde-change-connection-id={"conn_01928e4c2a8fc011b8b21ce728e5e4ac"}
          data-kinde-change-connection-psid={context.session.pipelineStepId}
          data-kinde-change-connection-action={JSON.stringify(context.actions.switchConnection)}
          data-kinde-change-connection-auth-intent="sign_in"
          data-kinde-change-connection-login-hint={context.auth?.providedEmail}
        >
          Sign in with Google
        </button>
      </DefaultLayout>
    </Root>
  );
};

// Page Component
export default async function Page(event: KindePageEvent): Promise<string> {
  const page = await DefaultPage(event);
  return renderToString(page);
}
