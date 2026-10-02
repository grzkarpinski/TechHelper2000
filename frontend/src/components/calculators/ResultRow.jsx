export default function ResultRow({ label, value, unit }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-success">
        {value} {unit}
      </span>
    </div>
  );
}
