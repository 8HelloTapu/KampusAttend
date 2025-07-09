import type { SVGProps } from 'react';

export default function KampusAttendLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>AttendaVision Logo</title>
      {/* Person */}
      <path d="M18 21a6 6 0 0 0-12 0" />
      <circle cx="12" cy="11" r="4" />
      {/* Graduation Cap */}
      <path d="M12 2l8 4-8 4-8-4 8-4z" />
      <path d="M4 10v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4" />
    </svg>
  );
}
