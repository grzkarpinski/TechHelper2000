function Label({ className = "", ...props }) {
  return <label className={`text-sm font-medium text-foreground ${className}`.trim()} {...props} />;
}

export { Label };
