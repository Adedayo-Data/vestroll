import { ApprovalStatus } from "@/components/team-mgt/details.types";

export type TabProps = {
  id: string;
  employeeName: string;
  profileImage: string;
  employeeRole: string;
  status: ApprovalStatus;
  submittedAt: string;
};

export type Timesheet = TabProps & {
  rate: number;
  totalWorked: number;
  totalAmount: number;
};

export type Milestone = TabProps & {
  milestoneName: string;
  milestoneCompleted: number;
  totalMilestone: number;
  amount: number;
  dueDate: string;
};

export const timesheets: Timesheet[] = [
  {
    id: '0x6885afa...63b3',
    employeeName: 'John Doe',
    profileImage: '/profileImage.png',
    employeeRole: 'Software Engineer',
    rate: 12.00,
    totalWorked: 11.65,
    totalAmount: 1200.00,
    status: 'Pending',
    submittedAt: '25th Oct 2025'
  },
  {
    id: '0x6885afa...63b3',
    employeeName: 'Cody Fisher',
    profileImage: '/profileImage.png',
    employeeRole: 'Front-end Developer',
    rate: 15.00,
    totalWorked: 18.55,
    totalAmount: 1200.00,
    status: 'Rejected',
    submittedAt: '25th Oct 2025'
  },
  {
    id: '0x6885afa...63b3',
    employeeName: 'Lizzie Alba',
    profileImage: '/profileImage.png',
    employeeRole: 'Backend Engineer',
    rate: 10.00,
    totalWorked: 12.33,
    totalAmount: 1200.00,
    status: 'Approved',
    submittedAt: '25th Oct 2025'
  }
];

export const milestones: Milestone[] = [
  {
    id: '0x6885afa...63b3',
    employeeName: 'John Doe',
    profileImage: '/profileImage.png',
    employeeRole: 'Software Engineer',
    milestoneName: 'Milestone 1',
    milestoneCompleted: 10,
    totalMilestone: 12,
    amount: 1200.00,
    status: 'Pending',
    dueDate: '25th Oct 2025',
    submittedAt: '25th Oct 2025'
  },
  {
    id: '0x6885afa...63b3',
    employeeName: 'Cody Fisher',
    profileImage: '/profileImage.png',
    employeeRole: 'Front-end Developer',
    milestoneName: 'Milestone 2',
    milestoneCompleted: 4,
    totalMilestone: 12,
    amount: 1200.00,
    status: 'Rejected',
    dueDate: '25th Oct 2025',
    submittedAt: '25th Oct 2025'
  },
  {
    id: '0x6885afa...63b3',
    employeeName: 'Lizzie Alba',
    profileImage: '/profileImage.png',
    employeeRole: 'Backend Engineer',
    milestoneName: 'Milestone 3',
    milestoneCompleted: 6,
    totalMilestone: 12,
    amount: 1200.00,
    status: 'Approved',
    dueDate: '25th Oct 2025',
    submittedAt: '25th Oct 2025'
  }
];
