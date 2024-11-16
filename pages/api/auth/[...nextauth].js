import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import clientPromise from "../../../util/mongodbClient"; // MongoDB Client import
import { connect } from "../../../util/database"; // MongoDB 연결
import User from "../../../models/users"; // User 모델 import

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
    }),
  ],
  secret: '2ELNv7bYOS1ArYC',
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, token }) {
      await connect();
      try {
        const user = await User.findOne({ email: session.user.email }).lean();
        if (user) {
          session.user._id = user._id.toString(); // ObjectId를 문자열로 변환하여 추가
        }
      } catch (error) {
        console.error("Error in session callback:", error);
      }
  
      return session;
    },
  },
};

export default NextAuth(authOptions);
