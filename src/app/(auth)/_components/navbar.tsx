import { auth } from "../../../db/auth";
import { buttonVariants } from "../../../components/button";
import { Button } from "../../../components/button";
import { GraduationCap, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="bg-white border-b w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center h-16 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-700" />
            <span className="text-xl font-bold text-gray-800">
              Swarn Foundation
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <form
                  action={async () => {
                    "use server";
                    await auth.api.signOut({
                      headers: await headers(),
                    });
                    redirect("/");
                  }}
                >
                  <Button
                    type="submit"
                    variant="ghost"
                    className="relative group px-2 py-2 text-sm font-medium text-gray-700 border border-transparent"
                 
                  >
                    Sign Out
                    <span className="absolute bottom-0 left-1/2 w-0 group-hover:w-full h-0.5 bg-red-600 transition-all duration-400 transform -translate-x-1/2 rounded-full"></span>
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/sign-in" className={buttonVariants()}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
