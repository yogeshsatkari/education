import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, oneTap, organization, username } from "better-auth/plugins";
import * as dotenv from "dotenv";
import { and, desc, eq } from "drizzle-orm";
import { db } from ".";
import { sendEmail } from "../utils/email";
import * as authSchema from "./schema/auth-schema";

dotenv.config({ path: "../.env" }); // not working, still taking from frontend .env

// Get the last organization the user was part of
async function getLastOrganization(userId: string) {
  // console.log("userId: ", userId);
  // Get all organizations where the user is an owner
  const userOrgs = await db
    .select({
      organization: authSchema.organization,
    })
    .from(authSchema.member)
    .where(
      and(
        eq(authSchema.member.userId, userId),
        eq(authSchema.member.role, "owner")
      )
    )
    .innerJoin(
      authSchema.organization,
      eq(authSchema.organization.id, authSchema.member.organizationId)
    )
    .orderBy(desc(authSchema.organization.createdAt))
    .limit(1);

  return userOrgs[0]?.organization || null;
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // don't automatically sign in after sign up
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log("sendResetPassword: ", user, url, token, request);
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("sendVerificationEmail: ", user, url, token, request);
      const verificationUrl = `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/auth/verify-email?token=${token}&callbackURL=${encodeURIComponent(
        "/sign-in"
      )}`;

      await sendEmail({
        to: user.email,
        subject: "Verify your email address - Swarn Foundation",
        text: `Click the link to verify your email: ${verificationUrl}`,
        html: `
          <div>
            <h1>Verify your email address - Swarn Foundation</h1>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
          </div>
        `,
      });
    },
    callbackURL: "/sign-in", //not working, The redirect URL after verification,
  },
  socialProviders: {
    google: {
      // enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: process.env.GOOGLE_REDIRECT_URI || "",
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
      // Optional
      appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER as string,
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const lastOrg = await getLastOrganization(session.userId);
          // console.log("lastOrg: ", lastOrg);
          return {
            data: {
              ...session,
              activeOrganizationId: lastOrg?.id || null,
            },
          };
        },
      },
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
    oneTap(),
    admin(),
    username(),
  ],
});
