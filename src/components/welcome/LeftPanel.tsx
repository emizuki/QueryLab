import { Heart, HardDriveUpload, HardDriveDownload, PlugZap } from "lucide-solid";
import { Button } from "../shared/Button";
import { useUI } from "../../stores/ui-store";
import logoSvg from "../../assets/logo.svg";

export function LeftPanel() {
  const [, ui] = useUI();

  return (
    <div class="flex flex-col items-center w-65 shrink-0 pt-10 pb-4 px-5">
      {/* App Icon */}
      <div class="w-18 h-18 rounded-[14px] bg-white shadow-lg flex items-center justify-center mb-3 overflow-hidden">
        <img src={logoSvg} alt="QueryLab" class="w-12 h-12" />
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
        <Button variant="secondary" class="w-full justify-start! h-auto! py-2">
          <HardDriveUpload size={14} />
          Backup database...
        </Button>
        <Button variant="secondary" class="w-full justify-start! h-auto! py-2">
          <HardDriveDownload size={14} />
          Restore database...
        </Button>
        <Button
          variant="secondary"
          class="w-full justify-start! h-auto! py-2"
          onClick={() => ui.openCreateForm()}
        >
          <PlugZap size={14} />
          Create connection...
        </Button>
      </div>
    </div>
  );
}
