# Deploying Traekkr CMS on Zone.eu

This project can be hosted on [Zone.eu](https://www.zone.eu/) (European web hosting with Node.js support). Zone provides **Node.js** on their web hosting plans (Starter: 512 MB RAM, Business: 768 MB, PRO: 1024 MB). Use **Business** or **PRO** for a Payload + Next.js app.

---

## Alternative: Site on Vercel, email on Zone.eu

If your **email** is on your domain at Zone (e.g. `you@yourdomain.com`), you can **host the website on Vercel** and **keep email on Zone** — you don’t lose mail access.

**How it works**

- **DNS** for your domain is managed in one place (Zone’s DNS, or your registrar if the domain is elsewhere).
- **Mail:** Keep **MX records** (and any SPF/DKIM Zone gave you) pointing to **Zone’s mail servers**. That keeps email working as it is.
- **Website:** Add the domain in [Vercel](https://vercel.com), then in DNS add the records Vercel shows (usually an **A** record for `@` and/or a **CNAME** for `www` pointing to Vercel). Web traffic for your domain then goes to Vercel; mail traffic still goes to Zone.

So:

| Purpose   | DNS records      | Points to   |
|----------|------------------|------------|
| Email    | MX (and SPF/DKIM)| Zone.eu    |
| Website  | A / CNAME        | Vercel     |

**Steps (high level)**

1. Deploy this Next.js app to Vercel (connect the repo, set `PAYLOAD_SECRET`, etc.). For the database: this app uses **SQLite** by default (local file), which does **not** persist on Vercel’s serverless environment. Use [Turso](https://turso.tech/) (libSQL) and set `DATABASE_URL` to your Turso URL + `DATABASE_AUTH_TOKEN`, or switch the app to MongoDB/Postgres and set `DATABASE_URL` to a hosted connection string.
2. In Vercel: add your domain (e.g. `yourdomain.com` and `www.yourdomain.com`).
3. In your DNS (at Zone or your registrar): leave **MX** (and mail-related records) as they are for Zone; add the **A** and/or **CNAME** values Vercel gives you for the site. Zone’s docs often call this “DNS” or “Domain settings”.
4. After DNS propagates, the site is served by Vercel and email stays on Zone.

You can keep a Zone hosting plan **only for email** (no need to run the Node app there), or use Zone just as domain registrar + DNS + mail. No code changes needed; this is only DNS and where you deploy the app.

---

## Order of steps (site hosted on Zone)

1. **Build the app** locally (standalone), then copy static files into the standalone folder.
2. **Upload the site files** to Zone — upload the *contents* of `.next/standalone/` to your domain/subdomain folder (WebFTP, FTP, or SSH). Ensure the folder is writable so SQLite can create the DB file (e.g. `data/`).
3. **Set environment variables** on Zone: `PAYLOAD_SECRET`, `NODE_ENV=production`. Optionally set `DATABASE_URL` to a `file:` path for the SQLite file (default is `./data/payload.sqlite` in the app directory).
4. **Configure mod_proxy** (or port forwarding) so the domain points at your Node app’s port (e.g. 3000).
5. **Add the app in PM2** so it keeps running (script = path to `server.js`).

On first run, the app will create the SQLite database and tables in the `data/` directory (or the path you set). No external database service is required.

## Important: Database (SQLite)

This app uses **SQLite** by default (Payload’s `@payloadcms/db-sqlite` adapter). The database is a **single file** (e.g. `data/payload.sqlite`) on the same server as the app.

**On Zone.eu**

- No external database is needed. Upload the app, set `PAYLOAD_SECRET` and `NODE_ENV=production`. The app will create the SQLite file in the `data/` directory (ensure the app directory is writable).
- Optionally set `DATABASE_URL` to a `file:` URL if you want the DB elsewhere (e.g. `file:/path/to/payload.sqlite`).

**If you prefer MongoDB or Postgres**

- You can switch the adapter back to `@payloadcms/db-mongodb` or use `@payloadcms/db-postgres` and set `DATABASE_URL` to a remote connection string (e.g. MongoDB Atlas, or a Postgres host). The deployment steps above still apply; only the database location changes.

## 1. Build the app (standalone)

From the project root (`traekkr/`):

```bash
pnpm install
pnpm build
```

**Important:** You must run **`pnpm build`** (production build). **`pnpm dev`** does not create the standalone folder — only a full build does. After the build you will have `.next/standalone/` and inside it `.next/standalone/.next/`.

This produces two things:

- **`.next/standalone/`** – the app to upload (has `server.js`, `.next/`, `node_modules/`). Next.js does **not** put the built JS/CSS/images inside it.
- **`.next/static/`** – the built static assets (JS, CSS, fonts, etc.). The running app expects them at **`.next/standalone/.next/static/`**, so you have to copy them in.

**Copy static into standalone (do this before uploading):**

From the project root (`traekkr/`), run:

```bash
cd .next/standalone
cp -r ../static .next/
cd ../..
```

What each line does:

1. **`cd .next/standalone`** – go into the standalone folder.
2. **`cp -r ../static .next/`** – copy the `static` folder (one level up, so `.next/static`) into `.next/` inside standalone. That creates `.next/standalone/.next/static/` with all the assets. The `-r` means “copy the whole folder”.
3. **`cd ../..`** – go back to the project root (`traekkr/`).

After this, **`.next/standalone/`** contains everything the app needs. Upload the **contents** of that folder to Zone (so on the server you see `server.js`, `.next/`, `node_modules/`, etc. in one folder).

**Alternative (one command from project root):**

```bash
cp -r .next/static .next/standalone/.next/
```

## 2. Upload to Zone

Upload the **contents** of `.next/standalone/` to your domain (or subdomain) folder on Zone, e.g. via:

- **WebFTP** (File manager in My Zone)
- **FTP** ([Zone FTP guide](https://www.zone.eu/support/kb/login-to-ftp/))
- **SSH** + `scp` or Git ([Zone SSH guide](https://www.zone.eu/support/kb/establishing-an-ssh-connection/))

So on the server, the folder that contains `server.js` should be your app root (e.g. your DocumentRoot or a subdomain folder). Note this full path; you’ll need it for PM2.

## 3. Environment variables on Zone

Set these in the app directory (e.g. `.env` in the same folder as `server.js`) or in Zone’s control panel if they support env vars:

| Variable         | Description |
|------------------|-------------|
| `DATABASE_URL`   | Optional. SQLite file path as `file:` URL (default: `./data/payload.sqlite` in app directory). |
| `PAYLOAD_SECRET` | Long, random secret (e.g. `openssl rand -hex 32`) |
| `NODE_ENV`       | `production` |

Optional (e.g. for order emails):

- `RESEND_API_KEY`
- `ORDER_TO_EMAIL`

Ensure `.env` is not publicly readable (outside the web root or with correct permissions).

## 4. Make the domain use the Node app (mod_proxy or port)

- In **My Zone** → **Webhosting** → **Main domain settings** or **Subdomains**, open the domain where the app is installed.
- In **mod_proxy backend port** set the port your app will listen on (e.g. **3000**).  
  Port must be between 1024 and 65535.
- If you need **WebSockets**, mod_proxy is not suitable; you need **port forwarding** (Zone states this requires a [Pro plan](https://www.zone.eu/web-hosting/) and a dedicated IP). For many Payload/Next setups, mod_proxy is enough.

## 5. Run the app with PM2

So the app keeps running after you disconnect:

1. In **My Zone** → **Webhosting** → **PM2 and Node.js** → **Add new application**.
2. **Name:** e.g. `traekkr`.
3. **Script or PM2 .JSON:** path to `server.js` in your uploaded standalone app.  
   Example (replace with your actual path):  
   `/path/to/your/domain/folder/server.js`
4. Set **maximum memory** (e.g. 512–768 MB depending on plan).
5. Save and wait a few minutes for PM2 to start the process.

If Zone allows setting the **working directory**, set it to the folder that contains `server.js` (same folder as `.next` and `node_modules` inside standalone).

## 6. Port and startup

- The Next.js standalone server uses **port 3000** by default, or `PORT` if set. Set `PORT` in `.env` to the same port you configured in mod_proxy (e.g. `3000`).
- After PM2 is active, open your domain in the browser; you should see the site and `/admin` for Payload.

## 7. If you prefer not to use standalone

You can deploy the full project instead:

1. Upload the whole project (or clone via Git if Zone provides it).
2. On the server: `pnpm install --prod` (or `npm ci --omit=dev`), then `pnpm build`.
3. In PM2, set the script to run `node_modules/.bin/next` with arguments `start`, and set the **working directory** to the project root. This uses more disk and memory than standalone.

## References

- [Zone.eu – Node.js on a Zone web server](https://support.zone.eu/kb/installing-a-nodejs-application-on-a-zone-web-server/)
- [Zone.eu – Change Node.js version](https://www.zone.eu/support/kb/changing-the-nodejs-version/)
- [Payload – Production deployment](https://payloadcms.com/docs/production/deployment)
