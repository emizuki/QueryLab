import { Show } from "solid-js";
import { ConnectionProvider } from "./stores/connection-store";
import { UIProvider, useUI } from "./stores/ui-store";
import { WelcomeWindow } from "./components/welcome/WelcomeWindow";
import { ConnectionForm } from "./components/connection-form/ConnectionForm";
import { ConfirmDialog } from "./components/shared/ConfirmDialog";
import { InputDialog } from "./components/shared/InputDialog";
import { Toast } from "./components/shared/Toast";

function AppContent() {
  const [uiState] = useUI();

  return (
    <>
      <WelcomeWindow />
      <Show when={uiState.showConnectionForm}>
        <ConnectionForm />
      </Show>
      <ConfirmDialog />
      <InputDialog />
      <Toast />
    </>
  );
}

function App() {
  return (
    <UIProvider>
      <ConnectionProvider>
        <AppContent />
      </ConnectionProvider>
    </UIProvider>
  );
}

export default App;
