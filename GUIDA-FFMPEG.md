# 🎥 Guida Completa FFmpeg per RTMP Streaming

## ✅ **FFmpeg Installato e Funzionante**

La tua installazione di FFmpeg è **perfetta** e include:
- **Versione:** 8.0-essentials_build
- **Codec:** H.264, H.265, VP8, VP9, AAC, MP3
- **Hardware Acceleration:** NVENC, CUDA, DXVA2, D3D11VA
- **Formati:** MP4, FLV, TS, M3U8 (HLS)

---

## 🎬 **Video di Test Creati**

### **1. test-video.mp4**
- **Durata:** 10 secondi
- **Risoluzione:** 1280x720 (HD)
- **Frame Rate:** 30 fps
- **Codec:** H.264
- **Audio:** Nessuno

### **2. test-video-with-audio.mp4**
- **Durata:** 15 secondi
- **Risoluzione:** 1280x720 (HD)
- **Frame Rate:** 30 fps
- **Codec:** H.264 + AAC
- **Audio:** Tono 1000Hz

---

## 🚀 **Comandi FFmpeg per Streaming**

### **1. Streaming da File Video**
```bash
# Stream un video esistente al server RTMP
ffmpeg -re -i test-video-with-audio.mp4 -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/test-stream
```

### **2. Streaming da Webcam**
```bash
# Stream dalla webcam (Windows)
ffmpeg -f dshow -i video="USB2.0 HD UVC WebCam" -f dshow -i audio="Microfono (Realtek Audio)" -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/webcam-stream
```

### **3. Streaming da Schermo**
```bash
# Cattura schermo e stream (richiede gdigrab)
ffmpeg -f gdigrab -i desktop -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/screen-stream
```

### **4. Streaming con Hardware Acceleration (NVIDIA)**
```bash
# Usa NVENC per encoding più veloce
ffmpeg -re -i test-video-with-audio.mp4 -c:v h264_nvenc -preset fast -c:a aac -f flv rtmp://localhost:1935/live/hw-stream
```

---

## 🎯 **Comandi per Test e Debug**

### **1. Informazioni Video**
```bash
# Mostra informazioni dettagliate su un video
ffmpeg -i test-video-with-audio.mp4
```

### **2. Conversione Formati**
```bash
# Converti MP4 in FLV per streaming
ffmpeg -i test-video-with-audio.mp4 -c:v libx264 -c:a aac test-video.flv

# Converti in HLS per web
ffmpeg -i test-video-with-audio.mp4 -c:v libx264 -c:a aac -hls_time 10 -hls_list_size 0 test-playlist.m3u8
```

### **3. Test Connessione RTMP**
```bash
# Testa se il server RTMP risponde
ffmpeg -f lavfi -i testsrc=duration=5:size=640x480:rate=30 -c:v libx264 -preset ultrafast -f flv rtmp://localhost:1935/live/test-connection
```

---

## ⚙️ **Parametri di Qualità**

### **Preset di Encoding (velocità vs qualità):**
- `ultrafast` - Più veloce, qualità bassa
- `superfast` - Veloce, qualità media
- `veryfast` - Veloce, buona qualità
- `faster` - Buona velocità, buona qualità
- `fast` - Bilanciato (raccomandato)
- `medium` - Qualità alta, più lento
- `slow` - Qualità molto alta, lento

### **Bitrate Video:**
```bash
# Streaming a bassa qualità (per connessioni lente)
-c:v libx264 -b:v 1000k

# Streaming a media qualità
-c:v libx264 -b:v 2500k

# Streaming ad alta qualità
-c:v libx264 -b:v 5000k
```

### **Bitrate Audio:**
```bash
# Audio a bassa qualità
-c:a aac -b:a 64k

# Audio a media qualità (raccomandato)
-c:a aac -b:a 128k

# Audio ad alta qualità
-c:a aac -b:a 320k
```

---

## 🔧 **Comandi per il Tuo Software RTMP**

### **1. Test Completo del Sistema**
```bash
# 1. Avvia il server RTMP (start.bat)
# 2. In un nuovo terminale, esegui:
ffmpeg -re -i test-video-with-audio.mp4 -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/test-stream
```

### **2. Streaming Continuo (Loop)**
```bash
# Ripeti il video in loop
ffmpeg -re -stream_loop -1 -i test-video-with-audio.mp4 -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/loop-stream
```

### **3. Streaming con Overlay Testo**
```bash
# Aggiungi testo al video
ffmpeg -re -i test-video-with-audio.mp4 -vf "drawtext=text='RTMP Stream Test':fontsize=30:fontcolor=white:x=10:y=10" -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/text-stream
```

---

## 📊 **Monitoraggio e Debug**

### **1. Statistiche in Tempo Reale**
```bash
# Mostra statistiche durante lo streaming
ffmpeg -re -i test-video-with-audio.mp4 -c:v libx264 -preset fast -c:a aac -f flv -stats rtmp://localhost:1935/live/stats-stream
```

### **2. Log Dettagliato**
```bash
# Salva log dettagliato
ffmpeg -re -i test-video-with-audio.mp4 -c:v libx264 -preset fast -c:a aac -f flv -loglevel debug rtmp://localhost:1935/live/debug-stream 2> ffmpeg.log
```

---

## 🎮 **Esempi Pratici**

### **Scenario 1: Test del Sistema**
```bash
# 1. Avvia start.bat
# 2. Apri http://localhost:3000
# 3. Esegui questo comando:
ffmpeg -re -i test-video-with-audio.mp4 -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/demo
# 4. Nel browser, inserisci "demo" e clicca "Watch Stream"
```

### **Scenario 2: Streaming da Webcam**
```bash
# Lista dispositivi disponibili
ffmpeg -list_devices true -f dshow -i dummy

# Stream da webcam (sostituisci con il nome del tuo dispositivo)
ffmpeg -f dshow -i video="USB2.0 HD UVC WebCam" -c:v libx264 -preset fast -c:a aac -f flv rtmp://localhost:1935/live/webcam
```

### **Scenario 3: Streaming con Qualità Personalizzata**
```bash
# Streaming HD 1080p a 60fps
ffmpeg -re -i test-video-with-audio.mp4 -vf "scale=1920:1080" -c:v libx264 -preset fast -b:v 5000k -r 60 -c:a aac -b:a 192k -f flv rtmp://localhost:1935/live/hd-stream
```

---

## 🆘 **Risoluzione Problemi**

### **Errore: "Connection refused"**
- Verifica che il server RTMP sia attivo (start.bat)
- Controlla che la porta 1935 sia libera

### **Errore: "Device not found"**
- Lista i dispositivi: `ffmpeg -list_devices true -f dshow -i dummy`
- Usa il nome esatto del dispositivo

### **Errore: "Permission denied"**
- Chiudi altre applicazioni che usano camera/microfono
- Riavvia FFmpeg

### **Qualità Video Bassa**
- Aumenta il bitrate: `-b:v 5000k`
- Usa preset più lento: `-preset medium`
- Verifica la risoluzione: `-vf "scale=1920:1080"`

---

## 🎉 **Il Tuo Setup è Perfetto!**

Con FFmpeg installato e configurato, hai tutto quello che serve per:
- ✅ Creare video di test
- ✅ Streaming da file
- ✅ Streaming da webcam
- ✅ Streaming da schermo
- ✅ Hardware acceleration
- ✅ Conversione formati
- ✅ Debug e monitoraggio

**Inizia con il comando di test e poi esplora le altre funzionalità!** 🚀


