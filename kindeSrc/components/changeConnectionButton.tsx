import React from "react";

export enum AuthIntent {
  Register = "sign_up",
  Login = "sign_in",
}

interface ChangeConnectionButtonProps {
  connectionId: string;
  pipelineStepId: string;
  switchConnectionAction: unknown;
  authIntent?: AuthIntent;
  loginHint?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ChangeConnectionButton: React.FC<ChangeConnectionButtonProps> = ({
  connectionId,
  pipelineStepId,
  switchConnectionAction,
  authIntent = AuthIntent.Register,
  loginHint,
  children,
  className,
  style,
}) => {
  return (
    <button
      type="button"
      className={className}
      style={style}
      data-kinde-change-connection-button="true"
      data-kinde-change-connection-id={connectionId}
      data-kinde-change-connection-psid={pipelineStepId}
      data-kinde-change-connection-action={JSON.stringify(switchConnectionAction)}
      data-kinde-change-connection-auth-intent={authIntent}
      data-kinde-change-connection-login-hint={loginHint}
    >
      {children}
    </button>
  );
};
