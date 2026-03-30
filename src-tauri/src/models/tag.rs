use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionTag {
    pub id: String,
    pub name: String,
    pub is_preset: bool,
    pub color: String,
}
