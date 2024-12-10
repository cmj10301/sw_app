import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import clientPromise from "../../../util/mongodbClient";
import { connect } from "../../../util/database";
import User from "../../../models/users";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
    }),
  ],
  secret: "2ELNv7bYOS1ArYC",
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, token }) {
      await connect();
      try {
        const user = await User.findOne({ email: session.user.email }).lean();
        if (user) {
          session.user._id = user._id.toString();
          session.user.allergies = user.알레르기 || []; // 알레르기 데이터를 세션에 포함
        }
      } catch (error) {
        console.error("Error in session callback:", error);
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      await connect();
      try {
        await User.findOneAndUpdate(
          { email: user.email },
          { $set: { name: user.name, image: user.image } },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error("Error in signIn callback:", error);
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      await connect();
      try {
        await User.findOneAndUpdate(
          { email: user.email },
          { $setOnInsert: { 알레르기: [] } },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error("Error in createUser event:", error);
      }
    },
  },
};

export default NextAuth(authOptions);
