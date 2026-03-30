import { Heart, HardDriveUpload, HardDriveDownload, PlugZap } from "lucide-solid";
import { Button } from "../shared/Button";
import { useUI } from "../../stores/ui-store";

export function LeftPanel() {
  const [, ui] = useUI();

  return (
    <div class="flex flex-col items-center w-[260px] shrink-0 pt-10 pb-4 px-5">
      {/* App Icon */}
      <div class="w-20 h-20 rounded-2xl bg-surface-secondary border border-border flex items-center justify-center mb-3">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <ellipse cx="20" cy="12" rx="14" ry="6" fill="#007AFF" opacity="0.8" />
          <path d="M6 12v16c0 3.31 6.27 6 14 6s14-2.69 14-6V12" fill="#007AFF" opacity="0.5" />
          <ellipse cx="20" cy="12" rx="14" ry="6" fill="#007AFF" />
          <ellipse cx="20" cy="12" rx="14" ry="6" fill="white" opacity="0.25" />
          <ellipse cx="20" cy="20" rx="14" ry="6" fill="#007AFF" opacity="0.3" />
          <ellipse cx="20" cy="28" rx="14" ry="6" fill="#007AFF" opacity="0.2" />
        </svg>
      </div>

      {/* App Title */}
      <h1 class="text-2xl font-bold text-text-primary tracking-tight">
        QueryLab
      </h1>
      <p class="text-[11px] text-text-secondary mt-0.5">Version 0.1.0</p>
      <p class="text-[11px] text-tag-pink mt-1.5 cursor-default flex items-center gap-1">
        <Heart size={12} fill="currentColor" />
        Sponsor QueryLab
      </p>

      {/* Spacer */}
      <div class="flex-1" />

      {/* Action buttons */}
      <div class="flex flex-col gap-2 w-full">
        <Button variant="secondary" class="w-full !justify-start !h-auto py-2">
          <HardDriveUpload size={14} />
          Backup database...
        </Button>
        <Button variant="secondary" class="w-full !justify-start !h-auto py-2">
          <HardDriveDownload size={14} />
          Restore database...
        </Button>
        <Button
          variant="secondary"
          class="w-full !justify-start !h-auto py-2"
          onClick={() => ui.openCreateForm()}
        >
          <PlugZap size={14} />
          Create connection...
        </Button>
      </div>
    </div>
  );
}
