# RTMP Streaming Software

A professional, modern RTMP streaming solution with a beautiful web interface for both streamers and viewers. This software provides a complete streaming infrastructure with real-time monitoring and management capabilities.

## 🚀 Features

### For Streamers
- **Easy Setup**: Simple web interface for stream configuration
- **Real-time Monitoring**: Live stream status and viewer count
- **Multiple Formats**: Support for H.264/AAC streaming
- **Professional Quality**: Optimized for high-quality streaming
- **Stream Management**: Start/stop streams with one click

### For Viewers
- **Live Stream Viewer**: Built-in HLS player for watching streams
- **Real-time Updates**: Automatic stream discovery and updates
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Stream Support**: Watch multiple streams simultaneously

### Technical Features
- **RTMP Server**: Built on node-media-server for reliability
- **HLS Support**: Automatic HLS conversion for web compatibility
- **WebSocket Integration**: Real-time updates and notifications
- **Modern UI**: Beautiful, responsive interface with dark theme
- **Cross-platform**: Works on Windows, macOS, and Linux

## 📋 Prerequisites

Before running the software, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)

2. **FFmpeg** (for video processing)
   - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg`

3. **Streaming Software** (optional, for external streaming)
   - OBS Studio (recommended)
   - XSplit
   - Wirecast
   - Or any RTMP-compatible software

## 🛠️ Installation

1. **Clone or Download** the project files to your desired directory

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment** (optional)
   ```bash
   cp env.example .env
   ```
   Edit `.env` file to customize settings if needed.

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Access the Web Interface**
   Open your browser and navigate to: `http://localhost:3000`

## 🎯 Quick Start Guide

### For Streamers

1. **Open the Web Interface**
   - Navigate to `http://localhost:3000`
   - You'll see the "Start Streaming" section

2. **Configure Your Stream**
   - Enter a unique stream key (e.g., "my-live-stream")
   - Note the RTMP URL: `rtmp://localhost:1935/live`

3. **Set Up Your Streaming Software**
   - **OBS Studio**: 
     - Go to Settings → Stream
     - Server: `rtmp://localhost:1935/live`
     - Stream Key: `my-live-stream`
   - **Bitrate**: Recommended 2500-5000 kbps

4. **Start Streaming**
   - Click "Start Stream" in the web interface
   - Begin streaming from your software
   - Monitor status and viewer count in real-time

### For Viewers

1. **View Active Streams**
   - The "Watch Streams" section shows all active streams
   - Click on any stream to start watching

2. **Manual Stream Access**
   - Enter a stream key in the "Stream Key to Watch" field
   - Click "Watch Stream" to load the video player

3. **Direct HLS Access**
   - Streams are available at: `http://localhost:8000/live/[STREAM_KEY]/index.m3u8`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root with the following options:

```env
# Server Ports
PORT=3000              # Web interface port
RTMP_PORT=1935         # RTMP server port
HTTP_PORT=8000         # HLS server port

# FFmpeg Path (if not in system PATH)
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe

# CORS Settings
CORS_ORIGIN=*

# Media Directory
MEDIA_ROOT=./media
```

### Streaming Settings

#### Recommended OBS Studio Settings:
- **Video Bitrate**: 2500-5000 kbps
- **Audio Bitrate**: 128-320 kbps
- **Resolution**: 1920x1080 or 1280x720
- **Frame Rate**: 30 fps
- **Encoder**: x264 (software) or NVENC (hardware)

#### Advanced Configuration:
- **Keyframe Interval**: 2 seconds
- **CPU Usage Preset**: veryfast or faster
- **Profile**: high
- **Tune**: zerolatency (for low latency)

## 📡 API Endpoints

The software provides REST API endpoints for integration:

### Get Active Streams
```http
GET /api/streams
```

### Get Specific Stream Info
```http
GET /api/stream/:streamKey
```

### Get HLS URL
```http
GET /api/stream/:streamKey/hls
```

### WebSocket Events
- `activeStreams`: List of current streams
- `streamStarted`: New stream notification
- `streamEnded`: Stream ended notification
- `viewerCountUpdate`: Viewer count changes

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   Streaming     │    │   RTMP Server   │
│                 │    │   Software      │    │                 │
│  - Stream UI    │    │  - OBS Studio   │    │  - node-media-  │
│  - Viewer       │    │  - XSplit       │    │    server       │
│  - Management   │    │  - Wirecast     │    │  - HLS Output   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Node.js App   │
                    │                 │
                    │  - Express      │
                    │  - Socket.IO    │
                    │  - Web Server   │
                    └─────────────────┘
```

## 🚨 Troubleshooting

### Common Issues

#### "Stream not available" Error (404 Not Found)
- **This is normal** when no one is currently streaming
- Ensure the streamer is actively streaming with the correct stream key
- Check if the stream key matches exactly (case-sensitive)
- Verify RTMP server is running on port 1935
- Use the test page: `http://localhost:3000/test-stream.html`

#### Camera/Microphone Access Denied
- Grant browser permissions for camera and microphone
- Check if other applications are using the devices
- Try refreshing the page

#### FFmpeg Not Found
- Install FFmpeg and add it to your system PATH
- Or set the `FFMPEG_PATH` environment variable
- Restart the server after installation

#### Port Already in Use
- Change the port numbers in `.env` file
- Or stop other services using the same ports
- Default ports: 3000 (web), 1935 (RTMP), 8000 (HLS)

### Performance Optimization

#### For High-Quality Streaming:
- Use hardware encoding (NVENC, QuickSync)
- Increase bitrate for better quality
- Use dedicated streaming hardware

#### For Low Latency:
- Reduce keyframe interval
- Use faster encoding presets
- Consider WebRTC for ultra-low latency

## 🔒 Security Considerations

### For Production Use:
1. **Authentication**: Implement user authentication
2. **API Keys**: Use API keys for stream access
3. **HTTPS**: Enable SSL/TLS encryption
4. **Firewall**: Restrict access to necessary ports
5. **Rate Limiting**: Implement rate limiting for API endpoints

### Network Security:
- Use VPN for remote access
- Implement IP whitelisting
- Monitor for unauthorized access
- Regular security updates

## 📈 Monitoring and Analytics

The software provides real-time monitoring capabilities:

- **Active Streams**: Current streaming sessions
- **Viewer Counts**: Real-time viewer statistics
- **Stream Duration**: How long streams have been active
- **Connection Status**: Server and client connection health

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup:
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review the API documentation
- Open an issue on the project repository

## 🔄 Updates and Changelog

### Version 1.0.0
- Initial release
- RTMP server with HLS support
- Modern web interface
- Real-time stream monitoring
- Cross-platform compatibility

---

**Happy Streaming! 🎥✨**
