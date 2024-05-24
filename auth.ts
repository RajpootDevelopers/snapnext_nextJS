import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connectToMongoDB } from "./lib/db";
import User from "./models/userModel";

export const {handlers, auth, signIn, signOut}= NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        await connectToMongoDB();
        try {
          const user = await User.findOne({ email: profile?.email });

          // signup if user not found;
          if (!user) {
            const newUser = await User.create({
              userName: profile?.login,
              email: profile?.email,
              fullName: profile?.name,
              avatar: profile?.avatar_url,
            });
            await newUser.save();
          }
          return true; // indicates successful sign-in
        } catch (err) {
          console.log(err);
          return false;
        }
      }
      return false; // indicates failed sign-in
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});


// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
// import { connectToMongoDB } from "./lib/db";
// import User from "./models/userModel";
// export const { handlers, auth, signIn, signOut } = NextAuth({ 
//     providers: [ 
//     GitHub({
//         clientId : process.env.AUTH_GITHUB_ID,
//         clientSecret : process.env.AUTH_GITHUB_SECRET,
//     })
//     ],
//     secret : process.env.AUTH_SECRET,
//     callbacks : {
//         async signIn({account, profile}){
//             if(account?.provider === "github"){
//                 await connectToMongoDB();
//                 try{
//                     const user = await User.findOne({email : profile?.email});

//                     // signup if user not found;
//                     if(!user) {
//                         const newUser = await User.create({
//                             userName : profile?.login,
//                             email : profile?.email,
//                             fullName : profile?.name,
//                             avatar : profile?.avatar_url
//                         })
//                         await newUser.save();
//                     }
//                     return true; // indicats successful sign-in;
//                 }catch(err){
//                     console.log(err)
//                     return false; 
//                 }
//             }
//             return false;  // indicats failed sign-in 
//         }
//     }
// })

