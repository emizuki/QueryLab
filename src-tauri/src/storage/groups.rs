use crate::models::group::ConnectionGroup;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

fn groups_path(app: &tauri::AppHandle) -> PathBuf {
    let data_dir = app.path().app_data_dir().expect("failed to get app data dir");
    fs::create_dir_all(&data_dir).ok();
    data_dir.join("groups.json")
}

#[tauri::command]
pub fn load_groups(app: tauri::AppHandle) -> Result<Vec<ConnectionGroup>, String> {
    let path = groups_path(&app);
    if !path.exists() {
        return Ok(vec![]);
    }
    let data = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn save_group(app: tauri::AppHandle, group: ConnectionGroup) -> Result<(), String> {
    let mut groups = load_groups(app.clone()).unwrap_or_default();
    if let Some(pos) = groups.iter().position(|g| g.id == group.id) {
        groups[pos] = group;
    } else {
        groups.push(group);
    }
    let path = groups_path(&app);
    let data = serde_json::to_string_pretty(&groups).map_err(|e| e.to_string())?;
    fs::write(&path, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_group(app: tauri::AppHandle, id: String) -> Result<(), String> {
    let mut groups = load_groups(app.clone()).unwrap_or_default();
    groups.retain(|g| g.id != id);
    let path = groups_path(&app);
    let data = serde_json::to_string_pretty(&groups).map_err(|e| e.to_string())?;
    fs::write(&path, data).map_err(|e| e.to_string())
}
