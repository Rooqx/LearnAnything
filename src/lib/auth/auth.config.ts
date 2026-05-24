import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Add additional fields if present on the user object
        const dbUser = user as any
        if (dbUser.displayname) {
          token.displayname = dbUser.displayname
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        if (token.displayname) {
          (session.user as any).displayname = token.displayname
        }
      }
      return session
    }
  }
} satisfies NextAuthConfig
