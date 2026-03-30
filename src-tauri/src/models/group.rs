use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionGroup {
    pub id: String,
    pub name: String,
    pub color: String,
}
