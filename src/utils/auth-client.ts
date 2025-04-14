import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  oneTapClient,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // the base url of your auth server. If the auth server is running on the same domain as the client, we can skip this line.
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    }),
    organizationClient(),
    adminClient(),
    usernameClient(),
  ],
});

export const { signIn, signUp, useSession } = authClient;
