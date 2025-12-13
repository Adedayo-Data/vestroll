'use client';

import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/utils/classNames";
import { Milestone, milestones } from "@/data/team-mgt";
import { currencies } from "@/util/constant";
import { useState } from "react";
import { getStatusIcon, getStatusClass, getStatusText } from "./status-lib";
import { createPortal } from "react-dom";
import { StatusModal } from "./status-modal";
import { FlagIcon } from "lucide-react";
import { DetailsConfig } from "./details.types";
import { DetailsView } from "./details-view";

function TeamMgtMilestone() {
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const handleStatusModal = (show: boolean) => setShowStatusModal(show);

  const MilestoneList = () => {
    return (
        <section>
      <div className="bg-white sm:bg-white p-4 rounded-lg">
        <div className="space-y-4 mb-6">
            <h2 className="text-base font-semibold text-gray-900">
                Milestone requests
            </h2>
        </div>

        {milestones.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="hidden md:table-header-group ltr:text-left rtl:text-right bg-gray-50 rounded-t-lg text-xs font-medium">
                <tr className="*:font-medium *:text-gray-500">
                  <th className="px-3 py-4 whitespace-nowrap">#</th>
                  <th className="px-3 py-4 whitespace-nowrap">
                    Employee
                  </th>
                  <th className="px-3 py-4 whitespace-nowrap">
                    Milestone completed
                  </th>
                  <th className="px-3 py-4 whitespace-nowrap">
                    Total milestone
                  </th>
                  <th className="px-3 py-4 whitespace-nowrap">
                    Total amount
                  </th>
                  <th className="px-3 py-4 whitespace-nowrap">
                    Paid in
                  </th>
                  <th className="px-3 py-4 whitespace-nowrap">Status</th>
                  <th className="px-3 py-4 whitespace-nowrap">Submitted</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {milestones.map((milestone, index) => (
                <tr className="*:text-[#17171C] *:first:font-medium cursor-pointer" key={index} onClick={() => setSelectedMilestone(milestone)}>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">{index + 1}</td>
                  {/* includes employee name, role, picture */}
                  <td className="hidden md:table-cell px-3 py-4 w-52 md:w-auto">
                    <div className="flex items-center gap-2">
                      <img src={milestone.profileImage} alt="img" className="w-10 h-10 rounded-full" />
                      <div className="flex flex-col">
                        <span className="font-medium">{milestone.employeeName}</span>
                        <span className="text-xs text-gray-500">{milestone.employeeRole}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 w-52 md:w-auto">
                    <div className="hidden md:table-cell line-clamp-1 md:line-clamp-none md:whitespace-nowrap">
                      {milestone.milestoneCompleted}
                    </div>
                    <div className="md:hidden line-clamp-1 md:line-clamp-none md:whitespace-nowrap">
                      {milestone.milestoneName}
                    </div>
                    {/* mobile view */}
                    <small className="text-xs md:hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[#7F8C9F]">${milestone.amount.toFixed(2)}</span>
                        <span className="text-[#DCE0E5]">|</span>
                        <p className="flex items-center gap-1">
                          <img src={currencies[0].icon} alt="fiat" className="w-5 h-5" />
                          <span className="text-[#17171C]">{currencies[0].label}</span>
                        </p>
                      </div>
                    </small>
                  </td>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">
                    {milestone.totalMilestone}
                  </td>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">
                    ${milestone.amount.toFixed(2)}
                  </td>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">
                    <div className="w-fit flex items-center gap-1 px-2 border bg-[#F5F6F7] rounded-xl">
                        <img src={currencies[0].icon} alt="fiat" className="w-5 h-5" />
                        <span className="text-[#17171C]">{currencies[0].label}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {/* Status */}
                    <div className={cn(
                      "px-2 py-1 rounded-full text-xs flex items-center gap-1 border w-fit",
                      getStatusClass(milestone.status)
                    )}>
                      {getStatusIcon(milestone.status)}
                      <span className="text-xs">{getStatusText(milestone.status)}</span>
                    </div>
                    {/* mobile view */}
                    <small className="md:hidden text-xs text-[#414F62]">{milestone.submittedAt}</small>
                  </td>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">{milestone.submittedAt}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No records yet"
            description="Looks like you're yet to receive any timesheet record"
          />
        )}
      </div>
    </section>
    );
  }

  const milestoneConfig: DetailsConfig<Milestone> = {
  title: "Milestone details",
  getStatus: (m) => m.status,

  header: {
    icon: (<FlagIcon className="text-purple-600" size={24} />),
    title: (m) => m.milestoneName,
    subtitle: (m) =>
      `${m.milestoneCompleted} of ${m.totalMilestone} milestones`,
  },

  summary: {
    leftLabel: "Amount",
    leftValue: (m) => `${m.amount} USD`,
    rightLabel: "Estimated due date",
    rightValue: (m) => m.dueDate,
  },

  description: "Monthly subscription for design and creative tools",

  attachments: {
    url: "https://via.placeholder.com/150",
    submittedAt: selectedMilestone?.submittedAt || "",
  },

  footerCards: {
    employeeId: selectedMilestone?.id || "",
    contract: selectedMilestone?.id || "",
    employeeName: selectedMilestone?.employeeName || "",
    employeeRole: selectedMilestone?.employeeRole || "",
  }
  };

  return (
    <>
      {selectedMilestone
      ? <DetailsView
            data={selectedMilestone}
            onBack={() => setSelectedMilestone(null)}
            onStatusChange={() => setShowStatusModal(true)}
            config={milestoneConfig}
        />
      : <MilestoneList />}

      {/* Status modal with createPortal */}
      {showStatusModal && createPortal(
        <StatusModal
            tabStatus={selectedMilestone?.status || "Pending"}
            handleStatusModal={handleStatusModal}
        />,
        document.body
      )}
    </>
  );
}

export default TeamMgtMilestone;
