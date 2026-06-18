"use server";

import { Widget } from "../../../../components/widget";
import { ChangeConnectionButton, AuthIntent } from "../../../../components/changeConnectionButton";
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
        <ChangeConnectionButton
          connectionId="conn_01928e4c2a8fc011b8b21ce728e5e4ac"
          pipelineStepId={context.session.pipelineStepId}
          switchConnectionAction={context.actions.switchConnection}
          authIntent={AuthIntent.Register}
          loginHint={context.auth?.providedEmail}
        >
          Sign in with Google
        </ChangeConnectionButton>
      </DefaultLayout>
    </Root>
  );
};

// Page Component
export default async function Page(event: KindePageEvent): Promise<string> {
  const page = await DefaultPage(event);
  return renderToString(page);
}
