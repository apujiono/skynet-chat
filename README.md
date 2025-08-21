# skynet-chat
# SkyNet Chat 🌌🤖

Platform komunikasi anonim seperti Twitch, BIGO Live, dan OnlyFans, dengan ketahanan Terminator-like. Mendukung live streaming, virtual gifts, paywall, dan anonimitas via Tor/IPFS.

## Fitur
1. **Live Streaming**: Gaming dan sosial dengan WebRTC, mendukung 3D avatars.
2. **Virtual Gifts**: Kirim bunga, roket, bintang via Stripe/crypto.
3. **Paywall**: Konten eksklusif dengan subscription (OnlyFans-style).
4. **Anonimitas**: Tor, E2EE, ZKP untuk privasi.
5. **Ketahanan**: Offline caching (IndexedDB), P2P (WebRTC).
6. **Interaksi**: Chat, polls, analytics, dan pesan darurat.

## Setup
1. Clone repositori: `git clone https://github.com/username/skynet-chat.git`
2. Install dependensi:
   - Backend: `pip install -r backend/requirements.txt`
   - Frontend: `cd frontend && npm install`
3. Tambah env variables: `STRIPE_API_KEY`, `STRIPE_PUBLIC_KEY`.
4. Jalankan lokal: `docker-compose up` atau `uvicorn backend.app.main:app --host 0.0.0.0 --port 8000`

## Deployment
1. Push ke GitHub (`main`).
2. Deploy via Railway.app.
3. Akses: `https://<your-app>.railway.app/frontend`.

## Penggunaan
- Login anonim tanpa email/nomor.
- Slash commands: `/msg`, `/sawer`, `/emergency`.
- Dashboard: Tombol untuk chat, stream, gift, dll.

## Lisensi
MIT
