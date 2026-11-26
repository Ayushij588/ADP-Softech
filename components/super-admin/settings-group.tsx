type SettingGroupProps = {
  title: string;
  description: string;
  settings: readonly { label: string; value: string }[];
};

export function SettingsGroup({
  title,
  description,
  settings,
}: SettingGroupProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <dl className="mt-5 divide-y divide-slate-100">
        {settings.map((setting) => (
          <div
            className="flex flex-col justify-between gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-6"
            key={setting.label}
          >
            <dt className="text-sm text-slate-600">{setting.label}</dt>
            <dd className="text-sm font-medium text-slate-900 sm:text-right">
              {setting.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
