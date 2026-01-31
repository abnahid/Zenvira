import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageBannerProps = {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
};

export default function PageBanner({ title, breadcrumbs }: PageBannerProps) {
  return (
    <div className="w-full bg-gray-100 border-b">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>

        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-primary transition"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">
                    {item.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="text-gray-400">›</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
