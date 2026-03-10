function Label({ className = "", ...props }) {
  return <label className={`text-sm font-medium text-slate-300 ${className}`.trim()} {...props} />;
}

export { Label };
