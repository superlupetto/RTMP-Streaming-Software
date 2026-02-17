while true; do
  # Avvia il processo Java
  node server.js

  # Controlla se il processo è in crash
  if [[ $? -ne 0 ]]; then
    echo "Processo Java crashato!"
    echo "Ricomincio..."
  fi

  # Aspetta 10 secondi prima di riavviare il processo
  sleep 10
done
