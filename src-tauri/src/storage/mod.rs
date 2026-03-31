use std::sync::Mutex;

pub struct StoreLock(pub Mutex<()>);

pub mod connections;
pub mod groups;
