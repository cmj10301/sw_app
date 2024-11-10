import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { connectDB } from "../../../util/database.js"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: 'Ov23lif9alTq69O0CL2m',
      clientSecret: 'a5dceff461e3b88b3725a73033f198d8e7036a63',
    }),
  ],
  secret : '2ELNv7bYOS1ArYC',
  adapter : MongoDBAdapter(connectDB)
};
export default NextAuth(authOptions); 