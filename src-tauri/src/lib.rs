// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use gstreamer::prelude::*;
use rosc::{encoder, OscMessage, OscPacket};
use std::collections::HashMap;
use std::net::UdpSocket;
use std::sync::Mutex;
use tauri::State;

struct AudioManager {
    // gives us a hashmap of gstreamer pipelines, similar to a Key-Value dictionary
    pipelines: HashMap<String, gstreamer::Element>,
}

struct AppState(pub Mutex<AudioManager>); // makes things mutable so we can edit runnings commands instead of creating new things

#[tauri::command]
async fn play_audio(id: String, uri: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut manager = state.inner().0.lock().unwrap(); // Get our audio manager so we can get multiple playing cues

    // Get any existing pipelines with our cue and stop it (i.e: we try and play our cue again)
    if let Some(existing) = manager.pipelines.get(&id) {
        existing
            .set_state(gstreamer::State::Null)
            .map_err(|e| e.to_string())?;
    }

    let pipeline = gstreamer::parse::launch(&format!(
        // get our audio file, process it and set it to our primary speakers
        "uridecodebin uri=\"{}\" ! audioconvert ! audioresample ! autoaudiosink",
        uri
    ))
    .map_err(|e| e.to_string())?;

    pipeline
        .set_state(gstreamer::State::Playing) // make it play
        .map_err(|e| e.to_string())?; //

    manager.pipelines.insert(id, pipeline); // set it to our state so that we can track it for future
    Ok(())
}

#[tauri::command]
fn fire_osc(osc_command: String, address: String, port: u32) -> Result<(), String> {
    // Create OSC message
    let message = OscMessage {
        addr: osc_command.to_owned(),
        args: vec![],
    };

    let packet = OscPacket::Message(message);

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
    gstreamer::init().expect("Gstreamer failed to load"); // if gstreamer fails to load

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState(Mutex::new(AudioManager {
            pipelines: HashMap::new(),
        })))
        .invoke_handler(tauri::generate_handler![fire_osc, play_audio])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
