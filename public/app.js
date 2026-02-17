class RTMPStreamingApp {
    constructor() {
        this.socket = io();
        this.mediaRecorder = null;
        this.stream = null;
        this.isStreaming = false;
        this.currentStreamKey = null;
        this.hls = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupSocketListeners();
    }

    initializeElements() {
        // Viewer elements
        this.activeStreamsContainer = document.getElementById('activeStreams');
        this.watchStreamKeyInput = document.getElementById('watchStreamKey');
        this.watchStreamBtn = document.getElementById('watchStream');

        // Player elements
        this.videoPlayer = document.getElementById('videoPlayer');
        this.playerStatus = document.getElementById('playerStatus');
        this.viewerCount = document.getElementById('viewerCount');

        // Modal elements
        this.helpBtn = document.getElementById('helpBtn');
        this.instructionsModal = document.getElementById('instructionsModal');
        this.closeModal = document.querySelector('.close');
    }

    setupEventListeners() {
        // Viewer controls
        this.watchStreamBtn.addEventListener('click', () => this.watchStream());

        // Modal controls
        this.helpBtn.addEventListener('click', () => {
            this.instructionsModal.style.display = 'block';
        });

        this.closeModal.addEventListener('click', () => {
            this.instructionsModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === this.instructionsModal) {
                this.instructionsModal.style.display = 'none';
            }
        });
    }

    setupSocketListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.updateConnectionStatus(true);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.updateConnectionStatus(false);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.updateConnectionStatus(false);
        });

        this.socket.on('reconnect', () => {
            console.log('Reconnected to server');
            this.updateConnectionStatus(true);
        });

        this.socket.on('activeStreams', (streams) => {
            this.updateActiveStreams(streams);
        });

        this.socket.on('streamStarted', (data) => {
            console.log('Stream started:', data);
            this.updateActiveStreams();
        });

        this.socket.on('streamEnded', (data) => {
            console.log('Stream ended:', data);
            this.updateActiveStreams();
        });

        this.socket.on('viewerCountUpdate', (data) => {
            this.updateViewerCount(data);
        });
    }


    async watchStream() {
        const streamKey = this.watchStreamKeyInput.value.trim();
        
        if (!streamKey) {
            alert('Please enter a stream key to watch');
            return;
        }

        try {
            this.watchStreamBtn.disabled = true;
            this.watchStreamBtn.innerHTML = '<div class="loading"></div> Loading...';

            const hlsUrl = `http://localhost:8000/live/${streamKey}/index.m3u8`;
            
            if (Hls.isSupported()) {
                if (this.hls) {
                    this.hls.destroy();
                }
                
                // HLS configuration for better stability
                const hlsConfig = {
                    debug: false,
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90,
                    maxBufferLength: 30,
                    maxMaxBufferLength: 60,
                    liveSyncDurationCount: 3,
                    liveMaxLatencyDurationCount: 5,
                    liveDurationInfinity: true,
                    highBufferWatchdogPeriod: 2,
                    nudgeOffset: 0.1,
                    nudgeMaxRetry: 3,
                    maxFragLookUpTolerance: 0.25,
                    liveBackBufferLength: 0,
                    maxLiveSyncPlaybackRate: 1.5,
                    manifestLoadingTimeOut: 10000,
                    manifestLoadingMaxRetry: 1,
                    levelLoadingTimeOut: 10000,
                    levelLoadingMaxRetry: 4,
                    fragLoadingTimeOut: 20000,
                    fragLoadingMaxRetry: 6,
                    startFragPrefetch: true,
                    testBandwidth: false,
                    progressive: false
                };
                
                this.hls = new Hls(hlsConfig);
                this.hls.loadSource(hlsUrl);
                this.hls.attachMedia(this.videoPlayer);
                
                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('HLS manifest parsed, starting playback');
                    this.videoPlayer.play();
                });

                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS error:', data);
                    if (data.fatal) {
                        if (data.details === 'manifestLoadError') {
                            this.showStreamError(`Stream "${streamKey}" non trovato. Assicurati che qualcuno stia trasmettendo con questa chiave.`);
                        } else {
                            this.showStreamError('Errore nel caricamento dello stream');
                        }
                    } else {
                        // Non-fatal errors - just log them
                        console.warn('HLS non-fatal error:', data.details);
                    }
                });

            } else if (this.videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                // Safari native HLS support
                this.videoPlayer.src = hlsUrl;
                this.videoPlayer.addEventListener('error', () => {
                    this.showStreamError(`Stream "${streamKey}" non trovato. Assicurati che qualcuno stia trasmettendo con questa chiave.`);
                });
            } else {
                this.showStreamError('HLS not supported in this browser');
            }

            // Update player status
            this.playerStatus.innerHTML = '<i class="fas fa-circle"></i> Watching Stream';
            this.playerStatus.className = 'status-indicator watching';
            this.watchStreamKeyInput.value = streamKey;

        } catch (error) {
            console.error('Error watching stream:', error);
            this.showStreamError('Error loading stream');
        } finally {
            this.watchStreamBtn.disabled = false;
            this.watchStreamBtn.innerHTML = '<i class="fas fa-play"></i> Watch Stream';
        }
    }

    showStreamError(message) {
        this.playerStatus.innerHTML = `<i class="fas fa-circle"></i> ${message}`;
        this.playerStatus.className = 'status-indicator not-streaming';
        this.videoPlayer.src = '';
    }

    updateActiveStreams(streams = null) {
        if (streams === null) {
            // Fetch current streams from server
            fetch('/api/streams')
                .then(response => response.json())
                .then(streams => this.updateActiveStreams(streams))
                .catch(error => console.error('Error fetching streams:', error));
            return;
        }

        if (streams.length === 0) {
            this.activeStreamsContainer.innerHTML = '<p class="no-streams">No active streams</p>';
            return;
        }

        const streamsHTML = streams.map(stream => `
            <div class="stream-item" onclick="app.selectStream('${stream.streamKey}')">
                <h4>${stream.streamKey}</h4>
                <p>
                    <i class="fas fa-clock"></i> Started: ${new Date(stream.startTime).toLocaleTimeString()}
                    <br>
                    <i class="fas fa-users"></i> ${stream.viewers} viewers
                </p>
            </div>
        `).join('');

        this.activeStreamsContainer.innerHTML = streamsHTML;
    }

    selectStream(streamKey) {
        this.watchStreamKeyInput.value = streamKey;
        this.watchStream();
    }

    updateViewerCount(data) {
        if (data.streamKey === this.watchStreamKeyInput.value) {
            this.viewerCount.innerHTML = `<i class="fas fa-users"></i> ${data.viewers} viewers`;
        }
    }

    updateConnectionStatus(connected) {
        // Add visual indicator for connection status
        const header = document.querySelector('.header');
        if (connected) {
            header.style.borderBottom = '3px solid #48bb78';
        } else {
            header.style.borderBottom = '3px solid #f56565';
        }
    }
}

// Initialize the application
const app = new RTMPStreamingApp();

// Global functions for onclick handlers
window.app = app;