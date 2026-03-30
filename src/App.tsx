import { Show } from "solid-js";
import { ConnectionProvider } from "./stores/connection-store";
import { UIProvider, useUI } from "./stores/ui-store";
import { WelcomeWindow } from "./components/welcome/WelcomeWindow";
import { ConnectionForm } from "./components/connection-form/ConnectionForm";

function AppContent() {
  const [uiState] = useUI();

  return (
    <>
      <WelcomeWindow />
      <Show when={uiState.showConnectionForm}>
        <ConnectionForm />
      </Show>
    </>
  );
}

function App() {
  return (
    <ConnectionProvider>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </ConnectionProvider>
  );
}

export default App;
