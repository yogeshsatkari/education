"use client";

import { authClient } from "@/utils/auth-client";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateOrganizationProps {
  headers: HeadersInit;
}

export function CreateOrganization({ headers }: CreateOrganizationProps) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateOrganization = async () => {
    try {
      setIsCreating(true);
      const newOrganization = await authClient.organization.create(
        {
          name: "My Organization",
          slug: `my-org-${new Date().toISOString().replace(/[:.]/g, "-")}`,
          logo: "https://cdn.vectorstock.com/i/1000x1000/59/99/org-logo-letter-design-vector-42725999.webp",
        },
        {
          headers,
        },
      );
      console.log("Created organization:", newOrganization);
    } catch (error) {
      console.error("Failed to create organization:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex justify-end">
      <button
        type="button"
        onClick={handleCreateOrganization}
        disabled={isCreating}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {isCreating ? "Creating..." : "Create New Organization"}
      </button>
    </div>
  );
}
