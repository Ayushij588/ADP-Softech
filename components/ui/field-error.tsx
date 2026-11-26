export function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p className="mt-1.5 text-sm text-rose-700" id={id} role="alert">
      {message}
    </p>
  );
}
