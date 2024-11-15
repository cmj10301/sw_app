// [...nextauth].js
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import clientPromise from "../../../util/mongodbClient"; // MongoDB Client import

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.clientId, 
      clientSecret: process.env.clientSecret,
    }),
  ],
  secret: '2ELNv7bYOS1ArYC',
  adapter: MongoDBAdapter(clientPromise),
};

export default NextAuth(authOptions);
