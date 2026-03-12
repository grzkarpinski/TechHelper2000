export default function ResultRow({ label, value, unit }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border py-2 text-sm last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-green-400">
        {value} {unit}
      </span>
    </div>
  );
}
