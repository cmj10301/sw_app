import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { connectDB } from "../../../util/database.js"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.clientId, 
      clientSecret: process.env.clientSecret,
    }),
  ],
  secret : '2ELNv7bYOS1ArYC',
  adapter : MongoDBAdapter(connectDB)
};
export default NextAuth(authOptions); 