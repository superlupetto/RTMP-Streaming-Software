# RTMP Streaming Software - PowerShell Launcher
# Esegui questo file con: .\start.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    RTMP Streaming Software" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js trovato: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host ""
    Write-Host "❌ ERRORE: Node.js non è installato o non è nel PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Per installare Node.js:" -ForegroundColor Yellow
    Write-Host "1. Vai su https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Scarica la versione LTS (Long Term Support)" -ForegroundColor White
    Write-Host "3. Esegui l'installer e segui le istruzioni" -ForegroundColor White
    Write-Host "4. Riavvia il computer dopo l'installazione" -ForegroundColor White
    Write-Host ""
    Read-Host "Premi INVIO per uscire"
    exit 1
}

# Check if npm is available
Write-Host ""
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ npm trovato: $npmVersion" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host ""
    Write-Host "❌ ERRORE: npm non è disponibile" -ForegroundColor Red
    Write-Host "npm dovrebbe essere installato insieme a Node.js" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Premi INVIO per uscire"
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "📦 Installazione dipendenze..." -ForegroundColor Yellow
    Write-Host "Questo potrebbe richiedere alcuni minuti..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Dipendenze installate con successo!" -ForegroundColor Green
        } else {
            throw "npm install failed"
        }
    } catch {
        Write-Host ""
        Write-Host "❌ ERRORE: Installazione dipendenze fallita" -ForegroundColor Red
        Write-Host "Controlla la connessione internet e riprova" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Premi INVIO per uscire"
        exit 1
    }
}

# Start the server
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Avvio Server RTMP Streaming" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Interfaccia Web: http://localhost:3000" -ForegroundColor Green
Write-Host "📡 Server RTMP: rtmp://localhost:1935" -ForegroundColor Green
Write-Host "📺 Server HLS: http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "💡 ISTRUZIONI:" -ForegroundColor Yellow
Write-Host "1. Apri il browser e vai su http://localhost:3000" -ForegroundColor White
Write-Host "2. Inserisci una chiave stream (es: mio-stream)" -ForegroundColor White
Write-Host "3. Usa rtmp://localhost:1935/live nel tuo software di streaming" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Premi Ctrl+C per fermare il server" -ForegroundColor Red
Write-Host ""
Write-Host "Avvio in corso..." -ForegroundColor Yellow
Write-Host ""

try {
    npm start
} catch {
    Write-Host ""
    Write-Host "❌ ERRORE: Impossibile avviare il server" -ForegroundColor Red
    Write-Host "Controlla che le porte 3000, 1935 e 8000 siano libere" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Server fermato." -ForegroundColor Yellow
Read-Host "Premi INVIO per uscire"
