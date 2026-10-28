import type { ReactNode } from 'react';

interface PageHeadingProps {
  title: string;
  /** Optional extra content under the title (e.g. a result count). */
  children?: ReactNode;
}

export default function PageHeading({ title, children }: PageHeadingProps) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
      {children && <div className="text-slate-600">{children}</div>}
    </div>
  );
}
