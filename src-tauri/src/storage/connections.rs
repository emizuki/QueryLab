use crate::models::connection::DatabaseConnection;
use crate::storage::StoreLock;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

fn connections_path(app: &tauri::AppHandle) -> PathBuf {
    let data_dir = app.path().app_data_dir().expect("failed to get app data dir");
    fs::create_dir_all(&data_dir).ok();
    data_dir.join("connections.json")
}

#[tauri::command]
pub fn load_connections(app: tauri::AppHandle) -> Result<Vec<DatabaseConnection>, String> {
    let path = connections_path(&app);
    if !path.exists() {
        return Ok(vec![]);
    }
    let data = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn save_connection(
    app: tauri::AppHandle,
    connection: DatabaseConnection,
    store_lock: tauri::State<'_, StoreLock>,
) -> Result<(), String> {
    let _guard = store_lock.0.lock().map_err(|e| e.to_string())?;
    let mut connections = load_connections(app.clone()).unwrap_or_default();
    if let Some(pos) = connections.iter().position(|c| c.id == connection.id) {
        connections[pos] = connection;
    } else {
        connections.push(connection);
    }
    let path = connections_path(&app);
    let data = serde_json::to_string_pretty(&connections).map_err(|e| e.to_string())?;
    fs::write(&path, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_connection(
    app: tauri::AppHandle,
    id: String,
    store_lock: tauri::State<'_, StoreLock>,
) -> Result<(), String> {
    let _guard = store_lock.0.lock().map_err(|e| e.to_string())?;
    let mut connections = load_connections(app.clone()).unwrap_or_default();
    connections.retain(|c| c.id != id);
    let path = connections_path(&app);
    let data = serde_json::to_string_pretty(&connections).map_err(|e| e.to_string())?;
    fs::write(&path, data).map_err(|e| e.to_string())
}

fn keyring_entry(service_suffix: &str, connection_id: &str) -> Result<keyring::Entry, String> {
    keyring::Entry::new(&format!("com.emizuki.querylab.{}", service_suffix), connection_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn save_password(connection_id: String, password: String) -> Result<(), String> {
    let entry = keyring_entry("password", &connection_id)?;
    entry.set_password(&password).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn load_password(connection_id: String) -> Result<Option<String>, String> {
    let entry = keyring_entry("password", &connection_id)?;
    match entry.get_password() {
        Ok(pw) => Ok(Some(pw)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn delete_password(connection_id: String) -> Result<(), String> {
    for suffix in &["password", "ssh_password", "ssh_passphrase"] {
        if let Ok(entry) = keyring_entry(suffix, &connection_id) {
            let _ = entry.delete_credential();
        }
    }
    Ok(())
}

#[tauri::command]
pub fn save_ssh_password(connection_id: String, password: String) -> Result<(), String> {
    let entry = keyring_entry("ssh_password", &connection_id)?;
    entry.set_password(&password).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn load_ssh_password(connection_id: String) -> Result<Option<String>, String> {
    let entry = keyring_entry("ssh_password", &connection_id)?;
    match entry.get_password() {
        Ok(pw) => Ok(Some(pw)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn save_ssh_passphrase(connection_id: String, passphrase: String) -> Result<(), String> {
    let entry = keyring_entry("ssh_passphrase", &connection_id)?;
    entry.set_password(&passphrase).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn load_ssh_passphrase(connection_id: String) -> Result<Option<String>, String> {
    let entry = keyring_entry("ssh_passphrase", &connection_id)?;
    match entry.get_password() {
        Ok(pw) => Ok(Some(pw)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}
