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
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0-.019 1.838L12 14l9.42-3.078Z"/>
      <path d="M10.73 12.91a2 2 0 0 0-1.46 1.46L8.12 20.3a1 1 0 0 0 1.73 1.05l1.39-3.92a2 2 0 0 0-1.55-2.52Z"/>
    </svg>
  );
}
