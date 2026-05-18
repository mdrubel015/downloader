from flask import Flask, request, jsonify
import yt_dlp
import random

app = Flask(__name__)

# List of your 28 IP blocks / specific IP addresses
# You should populate this with your server's assigned IPs
IP_POOL = [
    "103.1.1.1",
    "103.1.2.1",
    # ... add all 28 IPs here
]

@app.route('/api/info', methods=['GET'])
def get_info():
    video_url = request.args.get('url')
    if not video_url:
        return jsonify({"error": "No URL provided"}), 400

    # Pick a random IP from your pool for this request to avoid rate limits
    source_address = random.choice(IP_POOL) if IP_POOL else None

    ydl_opts = {
        'source_address': source_address, # This is the magic for your IP pool
        'quiet': True,
        'no_warnings': True,
        'format': 'best',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            
            # Extract only what we need for the UI
            formats = []
            for f in info.get('formats', []):
                # Filter for useful formats
                if f.get('vcodec') != 'none' or f.get('acodec') != 'none':
                    formats.append({
                        "id": f.get('format_id'),
                        "ext": f.get('ext'),
                        "resolution": f.get('resolution'),
                        "filesize": f.get('filesize'),
                        "url": f.get('url'), # Direct download link
                    })

            return jsonify({
                "title": info.get('title'),
                "thumbnail": info.get('thumbnail'),
                "duration": info.get('duration'),
                "uploader": info.get('uploader'),
                "formats": formats
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on Port 5000 on your VM
    app.run(host='0.0.0.0', port=5000)
