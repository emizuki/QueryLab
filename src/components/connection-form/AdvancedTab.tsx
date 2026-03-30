export function AdvancedTab() {
  return (
    <div class="flex flex-col gap-4 p-4">
      <div class="flex flex-col gap-1">
        <label class="text-xs text-text-secondary">Startup Commands</label>
        <textarea
          placeholder="SQL commands to run on connect..."
          class="h-24 rounded-md border border-border bg-surface-secondary px-2.5 py-2 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-accent resize-none font-mono"
        />
      </div>
      <p class="text-[11px] text-text-tertiary">
        These commands will be executed each time you connect to this database.
      </p>
    </div>
  );
}
