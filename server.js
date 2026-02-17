const NodeMediaServer = require('node-media-server');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// RTMP Server Configuration
const rtmpConfig = {
  rtmp: {
    port: process.env.RTMP_PORT || 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: process.env.HTTP_PORT || 8000,
    allow_origin: '*',
    mediaroot: './media',
  }
};

// Initialize RTMP Server
const nms = new NodeMediaServer(rtmpConfig);

// Store active streams
const activeStreams = new Map();
const hlsProcesses = new Map();

// FFmpeg path
const ffmpegPath = process.env.FFMPEG_PATH || 'C:\\Users\\super\\AppData\\Local\\UniGetUI\\Chocolatey\\bin\\ffmpeg.exe';

// HLS conversion functions
function startHLSConversion(streamKey) {
  const outputDir = path.join(__dirname, 'media', 'live', streamKey);
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // FFmpeg command for HLS conversion with better sync
  const ffmpegArgs = [
    '-i', `rtmp://localhost:1935/live/${streamKey}`,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-tune', 'zerolatency',
    '-g', '60',
    '-keyint_min', '60',
    '-c:a', 'aac',
    '-ar', '44100',
    '-ac', '2',
    '-b:a', '128k',
    '-f', 'hls',
    '-hls_time', '2',
    '-hls_list_size', '5',
    '-hls_flags', 'delete_segments+independent_segments',
    '-hls_allow_cache', '0',
    '-hls_segment_type', 'mpegts',
    '-hls_segment_filename', path.join(outputDir, 'segment%03d.ts'),
    path.join(outputDir, 'index.m3u8')
  ];
  
  console.log(`Starting HLS conversion for stream: ${streamKey}`);
  console.log(`FFmpeg command: ${ffmpegPath} ${ffmpegArgs.join(' ')}`);
  
  const hlsProcess = spawn(ffmpegPath, ffmpegArgs);
  hlsProcesses.set(streamKey, hlsProcess);
  
  hlsProcess.stdout.on('data', (data) => {
    console.log(`HLS ${streamKey} stdout: ${data}`);
  });
  
  hlsProcess.stderr.on('data', (data) => {
    console.log(`HLS ${streamKey} stderr: ${data}`);
  });
  
  hlsProcess.on('close', (code) => {
    console.log(`HLS conversion for ${streamKey} exited with code ${code}`);
    hlsProcesses.delete(streamKey);
  });
  
  hlsProcess.on('error', (err) => {
    console.error(`HLS conversion error for ${streamKey}:`, err);
    hlsProcesses.delete(streamKey);
  });
}

function stopHLSConversion(streamKey) {
  const hlsProcess = hlsProcesses.get(streamKey);
  if (hlsProcess) {
    console.log(`Stopping HLS conversion for stream: ${streamKey}`);
    hlsProcess.kill('SIGTERM');
    hlsProcesses.delete(streamKey);
  }
}

// RTMP Server Events
nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Extract stream key from path
  const streamKey = StreamPath.split('/').pop();
  activeStreams.set(streamKey, {
    id,
    streamPath: StreamPath,
    startTime: new Date(),
    viewers: 0
  });
  
  // Start HLS conversion
  startHLSConversion(streamKey);
  
  // Notify clients about new stream
  io.emit('streamStarted', {
    streamKey,
    streamPath: StreamPath,
    startTime: new Date()
  });
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Remove stream from active streams
  const streamKey = StreamPath.split('/').pop();
  activeStreams.delete(streamKey);
  
  // Stop HLS conversion
  stopHLSConversion(streamKey);
  
  // Notify clients about stream end
  io.emit('streamEnded', { streamKey });
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Increment viewer count
  const streamKey = StreamPath.split('/').pop();
  if (activeStreams.has(streamKey)) {
    activeStreams.get(streamKey).viewers++;
    io.emit('viewerCountUpdate', {
      streamKey,
      viewers: activeStreams.get(streamKey).viewers
    });
  }
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Decrement viewer count
  const streamKey = StreamPath.split('/').pop();
  if (activeStreams.has(streamKey)) {
    activeStreams.get(streamKey).viewers--;
    io.emit('viewerCountUpdate', {
      streamKey,
      viewers: activeStreams.get(streamKey).viewers
    });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current active streams to new client
  socket.emit('activeStreams', Array.from(activeStreams.entries()).map(([key, data]) => ({
    streamKey: key,
    ...data
  })));
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/streams', (req, res) => {
  const streams = Array.from(activeStreams.entries()).map(([key, data]) => ({
    streamKey: key,
    ...data
  }));
  res.json(streams);
});

app.get('/api/stream/:streamKey', (req, res) => {
  const { streamKey } = req.params;
  const stream = activeStreams.get(streamKey);
  
  if (stream) {
    res.json({ streamKey, ...stream });
  } else {
    res.status(404).json({ error: 'Stream not found' });
  }
});

app.get('/api/stream/:streamKey/hls', (req, res) => {
  const { streamKey } = req.params;
  const hlsUrl = `http://localhost:${rtmpConfig.http.port}/live/${streamKey}/index.m3u8`;
  res.json({ hlsUrl });
});

// Serve HLS files directly
app.get('/live/:streamKey/:filename', (req, res) => {
  const { streamKey, filename } = req.params;
  const filePath = path.join(__dirname, 'media', 'live', streamKey, filename);
  
  // Set appropriate headers for HLS
  if (filename.endsWith('.m3u8')) {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache');
  } else if (filename.endsWith('.ts')) {
    res.setHeader('Content-Type', 'video/mp2t');
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.log(`HLS file not found: ${filePath}`);
      res.status(404).send('Stream not found');
    }
  });
});

// Serve main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start servers
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
  console.log(`RTMP server running on port ${rtmpConfig.rtmp.port}`);
  console.log(`HLS server running on port ${rtmpConfig.http.port}`);
  console.log(`\nStream URL: rtmp://localhost:${rtmpConfig.rtmp.port}/live/YOUR_STREAM_KEY`);
  console.log(`HLS URL: http://localhost:${rtmpConfig.http.port}/live/YOUR_STREAM_KEY/index.m3u8`);
});

// Start RTMP server
nms.run();