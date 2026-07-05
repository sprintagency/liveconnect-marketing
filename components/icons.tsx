import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number | undefined, props: SVGProps<SVGSVGElement>) {
  return {
    width: size ?? 24,
    height: size ?? 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const ArrowRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size ?? 18, { strokeWidth: 2.4, ...p })}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Search = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const Users = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const UsersPlus = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </svg>
);

export const Bolt = ({ size, ...p }: IconProps) => (
  <svg {...base(size, { fill: "currentColor", stroke: "none", ...p })}>
    <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
  </svg>
);

export const Broadcast = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M4.9 19a10 10 0 0 1 0-14M7.8 16.2a6 6 0 0 1 0-8.5M16.2 7.8a6 6 0 0 1 0 8.5M19.1 5a10 10 0 0 1 0 14" />
    <circle cx="12" cy="12" r="1.6" />
  </svg>
);

export const Message = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const IdCard = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <rect x="2" y="4" width="20" height="16" rx="2.5" />
    <circle cx="8" cy="10" r="2.2" />
    <path d="M4.5 16c0.4-1.8 1.9-2.7 3.5-2.7s3.1 0.9 3.5 2.7" />
    <path d="M15 9.5h4M15 13.5h4" />
  </svg>
);

export const Mic = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10a7 7 0 0 1-14 0" />
    <path d="M12 17v4M8 21h8" />
  </svg>
);

export const PlusCircle = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

export const Lock = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const Star = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M12 2l2.9 6.3 6.6.6-5 4.4 1.5 6.5L12 17l-5.9 3.3L7.6 13.9l-5-4.4 6.6-.6z" />
  </svg>
);

export const Download = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M12 3v12M7 10l5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

export const Wifi = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M5 12.5a11 11 0 0 1 14 0" />
    <path d="M8.5 16a6 6 0 0 1 7 0" />
    <path d="M2 9a16 16 0 0 1 20 0" />
    <circle cx="12" cy="19.5" r="0.8" />
  </svg>
);

export const CheckCircle = ({ size, ...p }: IconProps) => (
  <svg {...base(size, { strokeWidth: 2.4, ...p })}>
    <circle cx="12" cy="12" r="10" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>
);
