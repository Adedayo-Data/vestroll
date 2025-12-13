'use client';

import EmptyState from "@/components/ui/EmptyState";
import { Clock2Icon } from "lucide-react";
import { cn } from "@/utils/classNames";
import { Timesheet, timesheets } from "@/data/team-mgt";
import { currencies } from "@/util/constant";
import { useState } from "react";
import { createPortal } from "react-dom";
import { DetailsConfig } from "./details.types";
import { StatusModal } from "./status-modal";
import { DetailsView } from "./details-view";
import { getStatusClass, getStatusIcon, getStatusText } from "./status-lib";

function TeamMgtTimeSheet() {
    const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const handleStatusModal = (show: boolean) => setShowStatusModal(show);

  const TimesheetList = () => {
    return (
        <section>
      <div className="bg-white sm:bg-white p-4 rounded-lg">
        <div className="space-y-4 mb-6">
            <h2 className="text-base font-semibold text-gray-900">
                Timesheet records
            </h2>
        </div>

        {timesheets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="hidden md:table-header-group ltr:text-left rtl:text-right bg-gray-50 rounded-t-lg text-xs font-medium">
                <tr className="*:font-medium *:text-gray-500">
                  <th className="px-3 py-4 whitespace-nowrap">#</th>
                  <th className="px-3 py-4 whitespace-nowrap">
                    Employee
                  </th>
                  <th className="px-3 py-4 whitespace-nowrap">
                    Rate
                  </th>
                  <th className="px-3 py-4 whitespace-nowrap">
                    Total worked
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
                {timesheets.map((timesheet, index) => (
                <tr className="*:text-[#17171C] *:first:font-medium cursor-pointer" key={index} onClick={() => setSelectedTimesheet(timesheet)}>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">{index + 1}</td>
                  {/* includes employee name, role, picture */}
                  <td className="hidden md:table-cell px-3 py-4 w-52 md:w-auto">
                    <div className="flex items-center gap-2">
                      <img src={timesheet.profileImage} alt="img" className="w-10 h-10 rounded-full" />
                      <div className="flex flex-col">
                        <span className="font-medium">{timesheet.employeeName}</span>
                        <span className="text-xs text-gray-500">{timesheet.employeeRole}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 w-52 md:w-auto">
                    <div className="hidden md:table-cell line-clamp-1 md:line-clamp-none md:whitespace-nowrap">
                      ${timesheet.rate.toFixed(2)}/hr
                    </div>
                    <div className="md:hidden line-clamp-1 md:line-clamp-none md:whitespace-nowrap">
                      {timesheet.totalWorked.toFixed(2)} hours
                    </div>
                    {/* mobile view */}
                    <small className="text-xs md:hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[#7F8C9F]">${timesheet.totalAmount.toFixed(2)}</span>
                        <span className="text-[#DCE0E5]">|</span>
                        <p className="flex items-center gap-1">
                          <img src={currencies[0].icon} alt="fiat" className="w-5 h-5" />
                          <span className="text-[#17171C]">{currencies[0].label}</span>
                        </p>
                      </div>
                    </small>
                  </td>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">
                    {timesheet.totalWorked.toFixed(2)}
                  </td>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">
                    ${timesheet.totalAmount.toFixed(2)}
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
                      getStatusClass(timesheet.status)
                    )}>
                      {getStatusIcon(timesheet.status)}
                      <span className="text-xs">{getStatusText(timesheet.status)}</span>
                    </div>
                    {/* mobile view */}
                    <small className="md:hidden text-xs text-[#414F62]">{timesheet.submittedAt}</small>
                  </td>
                  <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap">{timesheet.submittedAt}</td>
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

  const timesheetConfig: DetailsConfig<Timesheet> = {
    title: "Timesheet details",
    getStatus: (m) => m.status,

    header: {
      icon: (<Clock2Icon className="text-purple-600" size={24} />),
      title: (m) => m.employeeName,
      subtitle: (m) =>
        `${m.submittedAt} - ${new Date().toLocaleDateString()}`,
    },

    summary: {
      leftLabel: "Rate",
      leftValue: (m) => `${m.rate} USD / Hour`,
      rightLabel: "Total amount",
      rightValue: (m) => `${m.totalAmount} USD`,
    },

    description: "Monthly subscription for design and creative tools",

    attachments: {
      url: "https://via.placeholder.com/150",
      submittedAt: selectedTimesheet?.submittedAt || "",
    },

    footerCards: {
      employeeId: selectedTimesheet?.id || "",
      contract: selectedTimesheet?.id || "",
      employeeName: selectedTimesheet?.employeeName || "",
      employeeRole: selectedTimesheet?.employeeRole || "",
    }
  };

  return (
    <>
      {selectedTimesheet
      ? <DetailsView
            data={selectedTimesheet}
            onBack={() => setSelectedTimesheet(null)}
            onStatusChange={() => setShowStatusModal(true)}
            config={timesheetConfig}
        />
      : <TimesheetList />}

      {/* Status modal with createPortal */}
      {showStatusModal && createPortal(
        <StatusModal
            tabStatus={selectedTimesheet?.status || "Pending"}
            handleStatusModal={handleStatusModal}
        />,
        document.body
      )}
    </>
  );
}

export default TeamMgtTimeSheet;
