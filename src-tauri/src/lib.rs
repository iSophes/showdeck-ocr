// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use rosc::{encoder, OscMessage, OscPacket};
use std::net::UdpSocket;

#[tauri::command]
fn fire_osc(osc_command: &str, address: &str, port: u32) -> Result<(), String> {
    // Create OSC message
    let msg = OscMessage {
        addr: osc_command.to_owned(),
        args: vec![],
    };

    let packet = OscPacket::Message(msg);

    // Encode OSC packet
    let buffer = encoder::encode(&packet).map_err(|e| e.to_string())?;

    // Bind local UDP socket
    let socket = UdpSocket::bind("0.0.0.0:0").map_err(|e| e.to_string())?;

    // Send packet
    socket
        .send_to(&buffer, format!("{}:{}", address, port))
        .map_err(|e| e.to_string())?;

    println!("OSC message sent to {}:{}", address, port);

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![fire_osc])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
