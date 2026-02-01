interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  bgColor?: string;
  barColor?: string;
  trendColor?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  trend,
  bgColor = "bg-gray-50",
  barColor = "bg-gray-200",
  trendColor = "text-gray-600",
}: StatCardProps) {
  // Check if this is an admin-style card (no barColor/trendColor props) or seller-style (with color props)
  const isSellerStyle =
    barColor !== "bg-gray-200" || trendColor !== "text-gray-600";

  if (isSellerStyle) {
    // Seller Dashboard style - rounded with bottom bar
    return (
      <div className="rounded-xl shadow-md overflow-hidden bg-white flex flex-col h-40 justify-between transition hover:shadow-lg hover:-translate-y-0.5">
        <div className="p-6 flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium ${trendColor}`}>{label}</p>
            <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
            <p className={`text-xs mt-1 font-medium ${trendColor}`}>{trend}</p>
          </div>
          <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
        </div>
        {/* Bottom Color Bar */}
        <div className={`h-1 ${barColor}`} />
      </div>
    );
  }

  // Admin Dashboard style - flat card
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-green-600 text-xs font-medium mt-2">{trend}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
      </div>
    </div>
  );
}
