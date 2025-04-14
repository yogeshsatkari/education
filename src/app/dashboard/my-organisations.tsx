"use client";

import { authClient } from "@/utils/auth-client";
import { Building2, Clock, Link, Star, Trash2, UserPlus } from "lucide-react"; // Add icons
import { useState } from "react";
import { UpdateOrganization } from "./update-organisation";

interface OrganizationsListProps {
  headers: HeadersInit;
}

export function MyOrganizations({ headers }: OrganizationsListProps) {
  const { data: organizations } = authClient.useListOrganizations();
  const [isSettingActive, setIsSettingActive] = useState<string | null>(null);

  // show in descending order by createdAt
  if (organizations) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    organizations.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    // console.log("my organizations : : ", organizations);
  }

  const handleSetActive = async (organizationId: string) => {
    try {
      setIsSettingActive(organizationId);
      await authClient.organization.setActive({
        organizationId,
      });
      // Optionally refresh the page or show success message
      window.location.reload();
    } catch (error) {
      console.error("Failed to set active organization:", error);
    } finally {
      setIsSettingActive(null);
    }
  };

  const handleDelete = async (organizationId: string) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        await authClient.organization.delete({
          organizationId,
        });
        // Refresh the page after deletion
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete organization:", error);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
        <Building2 className="w-5 h-5" />
        My Organizations
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {organizations && organizations.length > 0 ? (
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          organizations.map((org: any) => (
            <div
              key={org.id}
              className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {org.logo ? (
                  <img
                    src={org.logo}
                    alt={`${org.name} logo`}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-medium text-lg text-gray-900">
                    {org.name}
                  </h3>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Link className="w-4 h-4" />
                      {org.slug}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Created {new Date(org.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
              <UpdateOrganization
                  headers={headers}
                  organizationId={org.id}
                  currentName={org.name}
                />
                <button
                  type="button"
                  onClick={() => handleSetActive(org.id)}
                  disabled={isSettingActive === org.id}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  {isSettingActive === org.id ? "Setting..." : "Set Active"}
                </button>
                <button
                  type="button"
                  // onClick={() => handleInviteUsers(org.id)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Users
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(org.id)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {/* Delete */}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-8 text-center bg-gray-50 rounded-lg">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No organizations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
