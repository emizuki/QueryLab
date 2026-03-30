import { Show } from "solid-js";
import { Activity } from "lucide-solid";
import { Button } from "../shared/Button";

interface FormFooterProps {
  isEditing: boolean;
  onTestConnection: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function FormFooter(props: FormFooterProps) {
  return (
    <div class="flex items-center px-4 py-3 border-t border-divider">
      <Button variant="secondary" onClick={props.onTestConnection}>
        <Activity size={13} />
        Test Connection
      </Button>

      <div class="flex-1" />

      <div class="flex items-center gap-2">
        <Show when={props.isEditing}>
          <Button variant="destructive" onClick={props.onDelete}>
            Delete
          </Button>
        </Show>
        <Button variant="secondary" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={props.onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
