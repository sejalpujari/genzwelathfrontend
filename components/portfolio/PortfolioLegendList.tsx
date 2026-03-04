"use client";

interface PortfolioItem {
  name: string;
  value: number;
  color: string;
  description?: string;
}

const PortfolioLegendList = ({ items }: { items: PortfolioItem[] }) => {
  return (
    <div className="mt-6 space-y-3">
      {items.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}
  suppressHydrationWarning={true}  // Add this here — targets the style mismatch directly
/>
            <div>
              <span className="font-medium text-gray-900">{item.name}</span>  {/* Fixed: show name here */}
              {item.description && (
                <p className="text-xs text-gray-600" suppressHydrationWarning={true}>
                  {item.description}
                </p>
              )}
            </div>
          </div>

          {/* Right-side percentage – add suppress here (this is likely the mismatch spot) */}
          <span
            className="font-bold text-gray-900"
            suppressHydrationWarning={true}
          >
            {item.value}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default PortfolioLegendList;