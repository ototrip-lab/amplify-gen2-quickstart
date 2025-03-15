"use client";

import {
  withAuthenticator,
  WithAuthenticatorProps,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function App({ signOut }: WithAuthenticatorProps) {
  return (
    <>
      <h1>Hello, Amplify 👋</h1>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}

export default withAuthenticator(App);
