import Link from "next/link";

type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="mx-auto mt-3 mb-6 w-full max-w-7xl px-4">
      <div className="flex min-w-0 items-center space-x-2 overflow-hidden text-sm leading-5">
        {items.map((item, index) => (
          <span className="flex min-w-0 items-center space-x-2" key={`${item.label}-${index}`}>
            {index > 0 && <span aria-hidden="true" className="shrink-0 text-[#94a3b8]">›</span>}
            {item.href ? <Link href={item.href} className="text-[#0f172a] hover:text-red-500">{item.label}</Link> : <span className="text-[#475569]">{item.label}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
