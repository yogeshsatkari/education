"use client";

import { authClient } from "@/utils/auth-client";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  PencilLine,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import React from "react";

interface AllUsersProps {
  headers: HeadersInit;
}

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  emailVerified: boolean;
  createdAt: string;
}
interface UserSession {
  id: string;
  userId: string;
  expiresAt: Date | string;
  lastActiveAt?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  token: string;
}

export function AllUsers({ headers }: AllUsersProps) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userSessions, setUserSessions] = useState<{
    [key: string]: UserSession[];
  }>({});
  const [loadingSessions, setLoadingSessions] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const { data } = await authClient.admin.listUsers({
        query: {
          limit: 100,
        },
        fetchOptions: {
          headers,
        },
      });

      if (data?.users) {
        const sortedUsers = [...data.users].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await authClient.admin.setRole(
        {
          userId,
          role: newRole,
        },
        {
          headers,
        }
      );
      toast.success(`User role updated to ${newRole}`);
      await fetchUsers(); // Refresh the list after role update
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsDeleting(userId);
      await authClient.admin.removeUser(
        {
          userId,
        },
        {
          headers,
        }
      );
      toast.success("User deleted successfully");
      await fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleShowSessions = async (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }

    try {
      setLoadingSessions(userId);
      setExpandedUser(userId);

      const { data } = await authClient.admin.listUserSessions({
        userId,
        fetchOptions: {
          headers,
        },
      });

      if (data?.sessions) {
        setUserSessions({
          ...userSessions,
          [userId]: data.sessions.map((session) => ({
            ...session,
            expiresAt:
              session.expiresAt instanceof Date
                ? session.expiresAt.toISOString()
                : session.expiresAt,
            lastActiveAt: new Date().toISOString(),
            ipAddress: session.ipAddress || null,
            userAgent: session.userAgent || null,
          })),
        });
      }
    } catch (error) {
      console.error("Failed to fetch user sessions:", error);
      toast.error("Failed to fetch user sessions");
    } finally {
      setLoadingSessions(null);
    }
  };

  const handleRevokeSession = async (sessionToken: string, userId: string) => {
    try {
      await authClient.admin.revokeUserSession(
        {
          sessionToken,
        },
        {
          headers,
        }
      );
      toast.success("Session revoked successfully");

      // Fetch fresh session data without collapsing
      try {
        setLoadingSessions(userId);
        const { data } = await authClient.admin.listUserSessions({
          userId,
          fetchOptions: {
            headers,
          },
        });

        if (data?.sessions) {
          setUserSessions({
            ...userSessions,
            [userId]: data.sessions.map((session) => ({
              ...session,
              expiresAt:
                session.expiresAt instanceof Date
                  ? session.expiresAt.toISOString()
                  : session.expiresAt,
              lastActiveAt: new Date().toISOString(),
              ipAddress: session.ipAddress || null,
              userAgent: session.userAgent || null,
            })),
          });
        }
      } catch (error) {
        console.error("Failed to refresh sessions:", error);
        toast.error("Failed to refresh sessions");
      } finally {
        setLoadingSessions(null);
      }
    } catch (error) {
      console.error("Failed to revoke session:", error);
      toast.error("Failed to revoke session");
    }
  };

  const handleRevokeAllSessions = async (userId: string) => {
    try {
      await authClient.admin.revokeUserSessions(
        {
          userId,
        },
        {
          headers,
        }
      );
      toast.success("All sessions revoked successfully");

      // Refresh sessions
      handleShowSessions(userId);
    } catch (error) {
      console.error("Failed to revoke all sessions:", error);
      toast.error("Failed to revoke all sessions");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3" />
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/4 px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
              User
            </th>
            <th className="w-1/4 px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
              Email
            </th>
            <th className="w-1/6 px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
              Role
            </th>
            <th className="w-1/6 px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
              Status
            </th>
            <th className="w-1/6 px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users?.map((user: UserType) => (
            <React.Fragment key={user.id}>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <span className="font-medium text-gray-500 truncate max-w-[150px]">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate max-w-[200px]">{user.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleRoleToggle(user.id, user.role)}
                    className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                      user.role === "admin"
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {user.role}
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.emailVerified
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {user.emailVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <PencilLine className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isDeleting === user.id}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShowSessions(user.id)}
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {loadingSessions === user.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                      ) : expandedUser === user.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
              {expandedUser === user.id && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 bg-gray-50">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">
                          Active Sessions
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleRevokeAllSessions(user.id)}
                          className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Revoke All Sessions
                        </button>
                      </div>
                      {userSessions[user.id]?.map((session) => (
                        <div
                          key={session.id}
                          className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                        >
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              Last active:{" "}
                              {session.lastActiveAt
                                ? new Date(
                                    session.lastActiveAt
                                  ).toLocaleString()
                                : "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              IP: {session.ipAddress || "Unknown"} • Agent:{" "}
                              {session.userAgent || "Unknown"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRevokeSession(session.token, user.id)
                            }
                            className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700"
                          >
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {!users?.length && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
}
