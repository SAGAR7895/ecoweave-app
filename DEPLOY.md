# EcoWeave — Setup & Deploy Guide

## ⚠️ Pehle ye padho — kaunse steps karne hain

Supabase ke do raste hain. **Sirf ek chunna hai, dono nahi.**

### 🅰️ Supabase Cloud (free tier) ← *tumne ye chuna hai*

Neeche wali poori file, seedha upar se neeche:

```
DEPLOY.md  A1 → A6      (Supabase cloud setup)
DEPLOY.md  B0 → B9      (server + Next.js + IIS)
```

SELF-HOSTING.md ko haath mat lagana.

### 🅱️ Self-hosted Supabase (Docker)

Yahan dono files mix hoti hain. **Ye exact order** follow karo:

| # | Kahan | Kya |
|---|---|---|
| 1 | DEPLOY.md **B0** | RDP se server tak pahunchna |
| 2 | SELF-HOSTING.md **1 → 8** | WSL2, Docker, Supabase, keys, SMTP, schema |
| 3 | DEPLOY.md **B1** | Node.js, Git, Caddy install |
| 4 | DEPLOY.md **B2** | Code server pe laana |
| 5 | DEPLOY.md **B3** | `.env.local` — par URL `https://api.ecoweave.in` |
| 6 | DEPLOY.md **B4 → B5** | Build + PM2 |
| 7 | SELF-HOSTING.md **9** | Caddy — **dono** domain ek saath |
| 8 | DEPLOY.md **B8** | Firewall |
| 9 | SELF-HOSTING.md **10 → 11** | Auto-start + **backup** |

**Ye skip karo:** `A1–A6` (wo cloud ke liye hain), `B6–B7` (Caddy
SELF-HOSTING step 9 mein hai), `B9` (self-host mein URL `.env` se set
hoti hai — SELF-HOSTING step 4 mein ho chuka).

---

## A. Supabase Setup (10 minute)

> 🅱️ **Self-host kar rahe ho? Poora Part A (A1–A6) SKIP karo.**
> Iski jagah [SELF-HOSTING.md](SELF-HOSTING.md) ke steps 1–8 hain.
> Seedha [Part B](#b-windows-server-pe-live-karna) pe jao.

### A1. Project banao
1. [supabase.com](https://supabase.com) pe jao → GitHub/email se sign up
2. **New Project** → naam: `ecoweave`
3. **Database Password** — strong password daalo aur **kahin safe likh lo**
4. **Region: Mumbai (ap-south-1)** chuno — India ke users ke liye sabse fast
5. Project ban-ne mein ~2 minute lagenge

### A2. Tables banao
1. Left sidebar → **SQL Editor** → **New query**
2. `supabase/schema.sql` file ka **poora content** copy karke paste karo
3. **Run** dabao
4. "Success. No rows returned" aana chahiye

Check karne ke liye: **Table Editor** kholo — `profiles` aur `artisan_applications` dikhne chahiye.

### A3. Keys copy karo
**Project Settings → API** (ya **Data API**) mein jao:

| Kya chahiye | Kahan milega |
|---|---|
| Project URL | `https://xxxx.supabase.co` |
| anon / publishable key | lambi `eyJ...` string |

> ⚠️ **`service_role` key kabhi use mat karna** is project mein. Wo saari security bypass kar deti hai.

### A4. Local pe env file bharo
`.env.local` file kholo aur asli values daalo:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### A5. Local pe chalao aur test karo

```bash
npm run dev
```

`http://localhost:3000` kholo aur ye test karo:
- [ ] Signup karo → email pe confirmation link aaya?
- [ ] Link click karo → dashboard khula?
- [ ] Logout → login → wapas dashboard?
- [ ] "Artisan Platform Join Karo" → form bhara → status "pending" dikha?

### A6. Khud ko admin banao
SQL Editor mein (apna email daalkar):

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'tumhara@email.com');
```

---

## B. Windows Server pe Live Karna

### B0. Server tak pahunchna
Windows server pe aam taur pe **RDP (Remote Desktop)** se jaate hain:

1. Apne PC pe **Win + R** dabao → `mstsc` type karo → Enter
2. Server ka **public IP** daalo → **Connect**
3. Server ka username/password daalo (jo hosting provider ne diya)

Ab server ka desktop dikhega. Waha **PowerShell** kholo (Start → PowerShell → right-click → *Run as Administrator*).

Pehle ye chalakar dekho ki kya pehle se hai:

```powershell
node -v; git --version; netstat -ano | findstr ":80 :443 :3000"
```

### B1. Software install karo
Windows Server pe sabse aasan tarika — `winget`:

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
winget install CaddyServer.Caddy
```

PowerShell **band karke dubara kholo** (PATH refresh hone ke liye), phir:

```powershell
node -v
npm -v
```

Agar `winget` na ho to seedha download karo:
- Node.js LTS → https://nodejs.org
- Git → https://git-scm.com/download/win
- Caddy → https://caddyserver.com/download (Windows amd64)

### B2. Code server pe laao
GitHub pe repo push karo (local se), phir server pe:

```powershell
cd C:\
git clone https://github.com/<tumhara-username>/ecoweave.git
cd C:\ecoweave\ecoweave-app
npm ci
```

### B3. Server pe env file banao

```powershell
notepad .env.local
```

Isme daalo (**ab asli domain**):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=https://ecoweave.in
```

### B4. Build karo

```powershell
npm run build
```

### B5. PM2 se chalao (auto-restart ke liye)

```powershell
npm install -g pm2
pm2 start node_modules\next\dist\bin\next --name ecoweave -- start -H 127.0.0.1
pm2 save
```

Server reboot pe apne aap start ho, iske liye:

```powershell
npm install -g pm2-windows-startup
pm2-startup install
pm2 save
```

Check: `pm2 status` aur `pm2 logs ecoweave`

### B6. Domain ko server se jodo

> 🅱️ **Self-host: B6 aur B7 dono SKIP karo.**
> Tumhe `api.` ka bhi ek A record chahiye aur Caddy mein do blocks —
> wo sab [SELF-HOSTING.md](SELF-HOSTING.md) ke **Step 9** mein ek saath hai.
> B8 (firewall) se aage continue karna.
Apne domain provider (GoDaddy / Hostinger / BigRock) ke DNS panel mein:

| Type | Name | Value |
|---|---|---|
| A | `@` | tumhare server ka public IP |
| A | `www` | tumhare server ka public IP |

DNS phailne mein 5 minute se 1 ghanta lag sakta hai. Check: `nslookup ecoweave.in`

### B7. IIS se Reverse Proxy aur HTTPS lagao
Ye sabse professional tareeka hai kyunki agar server par pehle se IIS (jaise ERP) chal raha hai, to wo disturb nahi hoga.

1. **Extensions:** Server par **URL Rewrite** aur **Application Request Routing (ARR)** download karke install karo.
2. **IIS Site Setup:** PowerShell (Admin) mein ye chalao:
```powershell
Import-Module WebAdministration
Set-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST' -filter "system.webServer/proxy" -name "enabled" -value "True"
New-Website -Name "EcoWeave" -Port 80 -HostHeader "www.ecoweave.in" -PhysicalPath "C:\ecoweave-app"
New-WebBinding -Name "EcoWeave" -IPAddress "*" -Port 80 -HostHeader "ecoweave.in"
```
3. **web.config:** `C:\ecoweave-app\web.config` file mein HTTP-to-HTTPS aur Reverse Proxy rules daalo.
4. **HTTPS / SSL:** **win-acme** download karo aur IIS ke liye auto-certificate generate karo:
```powershell
wacs.exe --target iis --site "EcoWeave" --installation iis --accepttos --email "admin@ecoweave.in"
```

### B8. Firewall kholo

```powershell
New-NetFirewallRule -DisplayName "HTTP"  -Direction Inbound -LocalPort 80  -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

> Agar cloud server hai (AWS/Azure/DigitalOcean), unke **Security Group / Network Firewall** mein bhi 80 aur 443 kholne padenge — sirf Windows firewall kaafi nahi hai.

### B9. Supabase ko domain batao

> 🅱️ **Self-host: B9 SKIP karo.** Ye settings self-hosted setup mein
> dashboard se nahi, `.env` file se aati hain (`SITE_URL`,
> `API_EXTERNAL_URL`, `SUPABASE_PUBLIC_URL`) — SELF-HOSTING.md ke
> **Step 4** mein bhar chuke ho.
Supabase Dashboard → **Authentication → URL Configuration**:

- **Site URL**: `https://ecoweave.in`
- **Redirect URLs** mein add karo:
  - `https://ecoweave.in/auth/confirm`
  - `http://localhost:3000/auth/confirm` (local testing ke liye)

Ye na kiya to confirmation email ka link kaam nahi karega.

---

## Baad mein update kaise karoge

```powershell
cd C:\ecoweave
git pull
cd ecoweave-app
npm ci
npm run build
pm2 restart ecoweave
```

---

## Kuch galat ho to

| Problem | Dekho |
|---|---|
| Site nahi khul rahi | `pm2 status`, `pm2 logs ecoweave` |
| HTTPS nahi lag raha | DNS sahi hai? Port 80 khula hai? Caddy logs dekho |
| Login ke baad turant logout | `.env.local` ki keys galat hain |
| Confirmation link kaam nahi kar raha | Step B9 kiya? |
| "row-level security" error | `schema.sql` poora chala tha? |
