/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { PermissionFormData, User } from "@/types/permissions-tab.types";
import React, { useState } from "react";
import BillingEmailSection from "./billing-email-section";
import PermissionsTableSection from "./permissions-table-section";
import { useRouter } from "next/navigation";
import PermissionFormView from "@/app/app/(dashboard)/settings/permissions/permission-form/page";

const initialUsers: User[] = [
  {
    id: 1,
    name: "James Akinbiola",
    email: "mailjames@gmail.com",
    permissions: ["Administrator"],
    status: "active",
  },
  {
    id: 2,
    name: "James Akinbiola",
    email: "mailjames@gmail.com",
    permissions: [
      "Team manager",
      "Expenses administrator",
      "External recruiter",
    ],
    status: "active",
  },
  {
    id: 3,
    name: "James Akinbiola",
    email: "mailjames@gmail.com",
    permissions: ["Administrator"],
    status: "invited",
  },
];

export default function PermissionsTab() {
  const [billingEmail, setBillingEmail] = useState<string>(
    "legend4tech1@gmail.com"
  );
  const [users, setUsers] = useState<User[]>(initialUsers);
  const router = useRouter();

  const openPermissionView = (user?: User): void => {
    if (user) {
      // Navigate to set-permission page with user data as query parameter
      const userData = encodeURIComponent(JSON.stringify(user));
      router.push(`/app/settings/permissions/permission-form?user=${userData}`);
    } else {
      // Navigate to set-permission page for new user
      router.push("/app/settings/permissions/permission-form");
    }
  };

  const handleDeleteUser = (userId: number): void => {
    const userToDelete = users.find((u) => u.id === userId);
    if (
      userToDelete &&
      window.confirm(`Are you sure you want to remove ${userToDelete.name}?`)
    ) {
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    }
  };

  return (
    <div className="w-full">
      <BillingEmailSection
        billingEmail={billingEmail}
        onEmailUpdate={setBillingEmail}
      />
      <PermissionsTableSection
        users={users}
        onEditUser={openPermissionView}
        onDeleteUser={handleDeleteUser}
        onSetPermission={() => openPermissionView()}
      />
    </div>
  );
}
