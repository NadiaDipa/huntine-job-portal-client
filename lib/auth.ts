import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

import { userRoleSchema } from "@/lib/roles"

const client = new MongoClient(process.env.BETTER_AUTH_MONGODB_URI as string)
const db = client.db("huntine-job-portal-db")

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        // Better Auth infers a `"seeker" | "recruiter" | "admin"` union from
        // the literal list, and the validator enforces it at runtime.
        type: ["seeker", "recruiter", "admin"],
        required: true,
        defaultValue: "seeker",
        input: true,
        validator: {
          input: userRoleSchema,
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    // Registration creates the account; the user signs in explicitly next.
    autoSignIn: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
})
