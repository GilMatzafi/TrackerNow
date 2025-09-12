"use client";

import JobColumn from './JobColumn';

interface Job {
  id: string;
  company: string;
  position: string;
  location?: string;
  salary?: string;
  note?: string;
  tags?: string[];
  status?: string;
  appliedDate?: string;
  interviewTime?: string;
  companyLogo?: string;
}

export default function KanbanBoard() {
  // Mock data - this will be replaced with real data from your backend
  const savedJobs: Job[] = [
    {
      id: '1',
      company: 'Facebook',
      position: 'Principal UI/UX Designer',
      location: 'Menlo Park, CA'
    },
    {
      id: '2',
      company: 'Zoom',
      position: 'Senior interaction Designer',
      location: 'Menlo Park, CA'
    },
    {
      id: '3',
      company: 'Taobao',
      position: 'UI/UX Designer',
      location: 'Menlo Park, CA'
    },
    {
      id: '4',
      company: 'Reddit',
      position: 'Senior Lead Designer',
      location: 'Menio Park, CA'
    },
    {
      id: '5',
      company: 'Opera',
      position: 'Principal UI/UX Designer Manager',
      location: 'Menio Park, CA'
    },
    {
      id: '6',
      company: 'Google',
      position: 'UI/UX Designer Manager',
      location: 'Menio Park, CA'
    }
  ];

  const appliedJobs: Job[] = [
    {
      id: '7',
      company: 'Mailchimp',
      position: 'UI/UX Designer Manager',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME'],
      appliedDate: 'Applied today'
    },
    {
      id: '8',
      company: 'Intercom',
      position: 'Sr. UI/UX Manager',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME'],
      appliedDate: 'Applied today'
    },
    {
      id: '9',
      company: 'Asana',
      position: 'Front-end Developer',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME'],
      appliedDate: 'Applied today'
    },
    {
      id: '10',
      company: 'Asana',
      position: 'Principal UI/UX Designer',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME'],
      appliedDate: 'Applied today'
    }
  ];

  const interviewJobs: Job[] = [
    {
      id: '11',
      company: 'Youtube',
      position: 'Backend Developer',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME'],
      interviewTime: 'Today 9:30 AM'
    },
    {
      id: '12',
      company: 'Pinterest',
      position: 'UI/UX Designer Manager',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME'],
      interviewTime: 'Today 9:30 AM'
    },
    {
      id: '13',
      company: 'Ubuntu',
      position: 'UI/UX Designer Manager',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME'],
      interviewTime: 'Today 9:30 AM'
    },
    {
      id: '14',
      company: 'Snapchat',
      position: 'UI/UX Designer Manager',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME'],
      interviewTime: 'Today 9:30 AM'
    },
    {
      id: '15',
      company: 'Whatsapp',
      position: 'UI/UX Designer Manager',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME'],
      interviewTime: 'Today 9:30 AM'
    }
  ];

  const rejectedJobs: Job[] = [
    {
      id: '16',
      company: 'Skrill',
      position: 'UI/UX Designer',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME']
    },
    {
      id: '17',
      company: 'Coinbase',
      position: 'Principal UI/UX Designer',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME']
    },
    {
      id: '18',
      company: 'Line',
      position: 'Principal UI/UX Designer',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME']
    },
    {
      id: '19',
      company: 'OK',
      position: 'UI/UX Designer',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME']
    }
  ];

  const offeredJobs: Job[] = [
    {
      id: '20',
      company: 'Atlassian',
      position: 'Lead UI/UX Designer',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME']
    },
    {
      id: '21',
      company: 'Microsoft',
      position: 'Product UI/UX Designer Manager',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME']
    },
    {
      id: '22',
      company: 'Gumroad',
      position: 'Principal UI/UX Designer Manager',
      salary: '$2000-$3000',
      note: 'This section will show notes refference o...',
      tags: ['REMOTE', 'FULL TIME']
    }
  ];

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6 w-full">
      <JobColumn
        title="Saved Jobs"
        count={savedJobs.length}
        jobs={savedJobs}
        color="gray"
      />
      
      <JobColumn
        title="Applied Jobs"
        count={appliedJobs.length}
        jobs={appliedJobs}
        color="blue"
      />
      
      <JobColumn
        title="Interviews"
        count={interviewJobs.length}
        jobs={interviewJobs}
        color="yellow"
      />
      
      <JobColumn
        title="Rejected Jobs"
        count={rejectedJobs.length}
        jobs={rejectedJobs}
        color="red"
      />
      
      <JobColumn
        title="Offered Jobs"
        count={offeredJobs.length}
        jobs={offeredJobs}
        color="green"
      />
    </div>
  );
}
