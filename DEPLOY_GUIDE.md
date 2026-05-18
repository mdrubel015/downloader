# Ultimate Video Downloader Deployment Guide

This project uses a hybrid architecture to maximize performance and bypass rate limits using your dedicated VM and IP blocks.

## 1. Setup Python API on your VM

1. **Access your VM via SSH.**
2. **Install system dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip
   ```
3. **Install Python libraries:**
   ```bash
   pip3 install flask yt-dlp
   ```
4. **Copy `downloader_api.py` to your VM:**
   Create the file and paste the code from this project.
5. **Configure your IP Pool:**
   Open `downloader_api.py` and update the `IP_POOL` list with your 28 IP addresses.
6. **Apply for Google/Adsterra Ads:**
   Place your Adsterra integration scripts in `src/App.tsx` inside the designated `Ad Placeholder` section.
7. **Run the API:**
   ```bash
   # Use nohup or screen to keep it running 24/7
   nohup python3 downloader_api.py > api.log 2>&1 &
   ```

## 2. Configure the Web App (Node.js)

1. Open the project **Settings / Secrets** in AI Studio.
2. Add a new secret named `VITE_VM_API_URL`.
3. Set the value to `http://YOUR_VM_IP:5000` (Replace `YOUR_VM_IP` with your actual VM's public IP).

## 3. How to scale
As your site grows, you can add more VMs or more IP blocks. Simply add the new IPs to the `IP_POOL` in your Python script and restart it. The Node.js frontend will automatically use the updated capabilities.

---
**Safety Note:** Make sure your VM's firewall allows incoming traffic on port 5000 only from the IP addresses of your web app host to keep the API secure.
