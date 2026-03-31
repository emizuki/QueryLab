use std::sync::Mutex;
use tauri::Manager;

mod models;
mod storage;

use storage::connections::{
    delete_connection, delete_password, load_connections, load_password, load_ssh_passphrase,
    load_ssh_password, save_connection, save_password, save_ssh_passphrase, save_ssh_password,
};
use storage::groups::{delete_group, load_groups, save_group};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(storage::StoreLock(Mutex::new(())))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            load_connections,
            save_connection,
            delete_connection,
            load_groups,
            save_group,
            delete_group,
            save_password,
            load_password,
            delete_password,
            save_ssh_password,
            load_ssh_password,
            save_ssh_passphrase,
            load_ssh_passphrase,
        ])
        .setup(|app| {
            let window = app
                .get_webview_window("main")
                .expect("window 'main' not found -- check app.windows in tauri.conf.json");

            #[cfg(target_os = "windows")]
            {
                use window_vibrancy::apply_mica;
                let _ = apply_mica(&window, None);
            }

            #[cfg(target_os = "macos")]
            {
                use window_vibrancy::{
                    apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState,
                };
                let _ = apply_vibrancy(
                    &window,
                    NSVisualEffectMaterial::UnderWindowBackground,
                    Some(NSVisualEffectState::Active),
                    None,
                );
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
