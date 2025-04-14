"use client";

import { authClient } from "@/utils/auth-client";
import { useState } from "react";

interface UpdateOrganizationProps {
  headers: HeadersInit;
  organizationId: string;
  currentName: string;
  onSuccess?: () => void;
}

export function UpdateOrganization({ headers, organizationId, currentName, onSuccess }: UpdateOrganizationProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateOrganization = async () => {
    try {
      setIsUpdating(true);
      const newName = currentName === "Apple" ? "Google" : "Apple";
      const newLogo = currentName === "Apple" ? "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/image8-2.jpg?width=893&height=600&name=image8-2.jpg" : "https://static.vecteezy.com/system/resources/previews/019/136/440/non_2x/apple-logo-apple-icon-free-free-vector.jpg";
      
      const updatedOrg = await authClient.organization.update(
        {
          data: {
            name: newName,
            logo: newLogo,
          },
          organizationId: organizationId,
        },
        {
          headers,
        }
      );
      
      console.log("Updated organization:", updatedOrg);
      if (onSuccess) {
        await onSuccess(); // Call the refetch function after successful update in all organizations component
      }
    } catch (error) {
      console.error("Failed to update organization:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
    type="button"
      onClick={handleUpdateOrganization}
      disabled={isUpdating}
      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
    >
      {isUpdating ? "Updating..." : "Update"}
    </button>
  );
}