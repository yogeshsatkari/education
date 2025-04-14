"use client";

import { authClient } from "@/utils/auth-client";
import { Clock, Building2, Link, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { UpdateOrganization } from "./update-organisation";

interface AllOrganizationsProps {
  headers: HeadersInit;
}

export function AllOrganizations({ headers }: AllOrganizationsProps) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizations = async () => {
    try {
      const { data: organizations } = await authClient.organization.list({
        fetchOptions: {
          headers,
        },
      });
      // console.log("all organisations: ", organizations);
      if (organizations) {
        const sortedOrgs = [...organizations].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrganizations(sortedOrgs);
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrganizations();
  }, []);

  if (loading) {
    return (
      <div className="w-full text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 border-t pt-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
        <Users className="w-5 h-5" />
        All Organizations
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {organizations.length > 0 ? (
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          organizations.map((org: any) => (
            <div
              key={org.id}
              className="p-4 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
              <div className="mt-4 flex gap-2">
                <UpdateOrganization
                  headers={headers}
                  organizationId={org.id}
                  currentName={org.name}
                  onSuccess={fetchOrganizations}
                />
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
