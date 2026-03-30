import { Search, X } from "lucide-solid";

interface SearchBarProps {
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
}

export function SearchBar(props: SearchBarProps) {
  return (
    <div class="relative flex-1">
      <Search
        size={13}
        class="absolute left-2 top-1/2 -translate-y-1/2 text-text-tertiary"
      />
      <input
        type="text"
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        placeholder={props.placeholder ?? "Search for connection..."}
        class="h-7 w-full rounded-md border border-border bg-surface-secondary pl-7 pr-2 text-[12px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-accent"
      />
      {props.value && (
        <button
          type="button"
          onClick={() => props.onInput("")}
          class="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary hover:text-text-secondary"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
