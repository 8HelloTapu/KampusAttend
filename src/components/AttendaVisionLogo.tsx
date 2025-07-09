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
      <title>KampusAttend Logo</title>
      {/* Student Body */}
      <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
      {/* Student Head */}
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
      {/* Graduation Cap */}
      <path d="M22 6l-10-4-10 4 10 4 10-4z" />
      {/* Tassel */}
      <path d="M18 6v4l2 1" />
    </svg>
  );
}
