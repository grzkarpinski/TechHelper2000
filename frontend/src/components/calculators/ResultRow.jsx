export default function ResultRow({ label, value, unit }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-success">
        {value} {unit}
      </span>
    </div>
  );
}
