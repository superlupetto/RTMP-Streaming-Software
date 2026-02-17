# 🔧 Risoluzione Problemi - RTMP Streaming Software

## ❌ Errore: "Permission denied" (Permessi negati)

### **Problema:**
Il browser non può accedere alla camera/microfono.

### **Soluzioni:**

#### **Chrome/Edge:**
1. Clicca sull'icona della **camera** nella barra degli indirizzi
2. Seleziona **"Consenti sempre"** per camera e microfono
3. Ricarica la pagina (F5)

#### **Firefox:**
1. Clicca sull'icona dello **scudo** nella barra degli indirizzi
2. Clicca su **"Disabilita protezione per questa pagina"**
3. Ricarica la pagina (F5)

#### **Safari:**
1. Vai su **Safari** → **Preferenze** → **Siti Web**
2. Seleziona **Camera** e **Microfono**
3. Imposta su **"Consenti"** per localhost

---

## ❌ Errore: "ERR_CONNECTION_REFUSED"

### **Problema:**
Il server si è fermato o non è raggiungibile.

### **Soluzioni:**

1. **Riavvia il server:**
   ```bash
   # Chiudi la finestra del server (Ctrl+C)
   # Poi esegui di nuovo:
   .\start.bat
   ```

2. **Controlla che le porte siano libere:**
   - Porta 3000 (Web Interface)
   - Porta 1935 (RTMP Server)
   - Porta 8000 (HLS Server)

3. **Riavvia il browser** completamente

---

## ❌ Errore: "404 Not Found" per HLS

### **Problema:**
Nessuno sta trasmettendo con quella chiave stream.

### **Soluzioni:**

1. **Questo è normale** se non c'è nessuno streaming attivo
2. **Installa OBS Studio** per testare:
   - Scarica da: https://obsproject.com/
   - Configura con: `rtmp://localhost:1935/live`
   - Stream Key: `test-stream`
3. **Avvia lo streaming** in OBS
4. **Torna al browser** e guarda lo stream

---

## ❌ Errore: "Camera o microfono già in uso"

### **Problema:**
Un'altra applicazione sta usando i dispositivi.

### **Soluzioni:**

1. **Chiudi altre applicazioni** che usano camera/microfono:
   - Skype, Teams, Zoom
   - OBS Studio
   - Altre app di streaming

2. **Riavvia il browser**

3. **Controlla il Task Manager** per processi che usano la camera

---

## ✅ Test Completo del Sistema

### **1. Verifica Server:**
```
http://localhost:3000/test-stream.html
```

### **2. Testa Streaming con OBS:**
- **Server:** `rtmp://localhost:1935/live`
- **Stream Key:** `test-stream`
- **Bitrate:** 2500 kbps

### **3. Verifica nel Browser:**
- Vai su `http://localhost:3000`
- Inserisci `test-stream`
- Clicca "Watch Stream"

---

## 🆘 Se Niente Funziona

### **Reset Completo:**

1. **Chiudi tutto:**
   - Browser
   - Server (Ctrl+C)
   - OBS Studio

2. **Riavvia il computer**

3. **Riapri tutto:**
   - `.\start.bat`
   - Browser su `http://localhost:3000`

### **Controlli Finali:**

- ✅ Node.js installato: `node --version`
- ✅ Porte libere: 3000, 1935, 8000
- ✅ Permessi browser per camera/microfono
- ✅ Nessuna altra app usa la camera

---

## 📞 Supporto

Se hai ancora problemi:
1. Controlla la console del browser (F12)
2. Controlla i log del server
3. Verifica che Node.js sia installato correttamente
4. Prova con un browser diverso


