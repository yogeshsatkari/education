import { auth } from "../../db/auth";
import {
  Activity,
  Clock,
  Globe,
  GraduationCap,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AllOrganizations } from "./all-organisations";
import { CreateOrganization } from "./create-organisation";
import { MyOrganizations } from "./my-organisations";
import { CreateUser } from "./create-users";
import { AllUsers } from "./all-users";
import Navbar from "../(auth)/_components/navbar";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/");
  }
  const user = session.user;
  const headersList = await headers();

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Activity className="w-4 h-4" />
                  <span className="font-medium">Active Org ID:</span>
                  <span className="font-mono text-sm">
                    {session.session.activeOrganizationId}
                  </span>
                </p>
              </div>
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Email Verified:</span>
                  <span
                    className={
                      user.emailVerified ? "text-green-500" : "text-red-500"
                    }
                  >
                    {user.emailVerified ? "Yes" : "No"}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Created:</span>
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Username:</span> {user.username}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-8">
            {/* Users Section */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  User Management
                </h2>
              </div>
              <CreateUser headers={headersList} />
              <AllUsers headers={headersList} />
            </section>

            {/* Organizations Section */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Organization Management
                </h2>
              </div>
              <div className="space-y-6">
                <CreateOrganization headers={headersList} />
                <MyOrganizations headers={headersList} />
                <AllOrganizations headers={headersList} />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-800">
                Swarn Foundation
              </span>
            </div>
            <p className="text-gray-500 text-sm md:text-base text-center">
              © 2025 Swarn Foundation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
