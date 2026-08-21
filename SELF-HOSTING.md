# Supabase Self-Hosting — Windows Server + Docker

Apne server par khud Supabase chalane ka poora tarika.

> **Pehle ye padh lo:** Supabase cloud ka free tier bhi bilkul free hai
> (500 MB DB, 1 GB storage, 50k users) — usme card nahi lagta. Self-host
> karne par paisa nahi lagta, **mehnat lagti hai**: backup, security
> update, uptime — sab tumhare zimme. Server band = site band.
> Agar phir bhi self-host karna hai, aage padho.

> **Ye file akeli kaafi nahi hai.** Isme sirf Supabase hai. Next.js app
> chalane ke steps [DEPLOY.md](DEPLOY.md) ke Part B mein hain, aur dono
> ko beech-beech mein mila kar karna padta hai.
>
> **Poora order [DEPLOY.md](DEPLOY.md) ke sabse upar wali table mein hai —
> pehle wahi dekh lo**, warna kuch steps do baar ho jaayenge.

---

## Architecture

```
        Internet
           |
    ┌──────┴───────────────────────────┐
    │      WINDOWS SERVER              │
    │                                  │
    │  Caddy (80/443) — free SSL       │
    │    ├── ecoweave.in     -> :3000  │  Next.js (Windows par)
    │    └── api.ecoweave.in -> :8000  │  Supabase gateway
    │                                  │
    │  ┌────────── WSL2 (Ubuntu) ────┐ │
    │  │  Docker: Supabase ke ~13    │ │
    │  │  containers                 │ │
    │  │  postgres, auth, storage,   │ │
    │  │  envoy, realtime, studio... │ │
    │  └─────────────────────────────┘ │
    └──────────────────────────────────┘
```

Supabase **WSL2 ke andar** chalega, Next.js aur Caddy Windows par.

---

## Step 1 — WSL2 + Docker

Windows Server par Docker Desktop ki jagah **WSL2 + Docker Engine** use karo —
ye zyada stable hai aur licensing ka jhanjhat nahi.

PowerShell **Administrator** mein:

```powershell
wsl --install -d Ubuntu
```

Server **restart** karo. Restart ke baad Ubuntu khud khulega aur username/password
maangega — apna bana lo.

Ab Ubuntu terminal mein Docker install karo:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

```bash
sudo usermod -aG docker $USER && newgrp docker
```

Check karo:

```bash
docker run --rm hello-world
```

---

## Step 2 — Supabase code laao

Ubuntu terminal mein (Windows drive par nahi, WSL ke apne home mein — wahan
bahut tez chalta hai):

Pinned version clone karo — `main` branch kabhi bhi toota hua ho sakta hai:

```bash
cd ~ && git clone --depth 1 --branch self-hosted/v0.8.0 https://github.com/supabase/supabase
```

```bash
cd ~/supabase/docker && cp .env.example .env
```

---

## Step 3 — Keys generate karo

Ye sabse important step hai. **Default values kabhi mat chhodna** — wo public
hain, koi bhi tumhara database khol lega.

### 3a. Random secrets

Har key ki apni length hai — chhoti ya lambi hui to container start hi
nahi hoga. Ye poora block ek saath paste karo:

```bash
r() { openssl rand -base64 96 | tr -dc 'A-Za-z0-9' | head -c "$1"; }
echo "POSTGRES_PASSWORD:   $(r 32)"
echo "JWT_SECRET:          $(r 40)"
echo "SECRET_KEY_BASE:     $(r 64)"
echo "VAULT_ENC_KEY:       $(r 32)"
echo "REALTIME_DB_ENC_KEY: $(r 16)"
echo "PG_META_CRYPTO_KEY:  $(r 32)"
echo "LOGFLARE_PUBLIC:     $(openssl rand -hex 16)"
echo "LOGFLARE_PRIVATE:    $(openssl rand -hex 16)"
```

Output kahin safe jagah copy kar lo.

> Sirf letters aur numbers isliye use kiye hain — `+`, `/`, `=` jaise
> characters database connection string ko tod dete hain, aur wo error
> dhoondhne mein ghante lag jaate hain.

| Key | Length | Kyun |
|---|---|---|
| `SECRET_KEY_BASE` | **kam se kam 64** | Realtime + Supavisor |
| `VAULT_ENC_KEY` | **theek 32** | Supavisor |
| `REALTIME_DB_ENC_KEY` | **theek 16** | Realtime |
| `PG_META_CRYPTO_KEY` | **kam se kam 32** | Postgres Meta |

### 3b. ANON_KEY aur SERVICE_ROLE_KEY

Ye do keys upar wale `JWT_SECRET` se **sign** hoti hain — random nahi ho
saktin. Official generator use karo:

👉 https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys

Page par apna `JWT_SECRET` paste karo, aur wo `ANON_KEY` aur
`SERVICE_ROLE_KEY` bana dega.

> ⚠️ `SERVICE_ROLE_KEY` saari Row Level Security ko bypass karti hai.
> Isko kabhi bhi `NEXT_PUBLIC_` ke saath mat likhna, na hi browser code
> mein. Leak hui to poora database khul jaayega.

---

## Step 4 — .env bharo

```bash
nano ~/supabase/docker/.env
```

Ye values badlo:

```ini
############ Secrets ############
POSTGRES_PASSWORD=<step 3a wala>
JWT_SECRET=<step 3a wala>
ANON_KEY=<step 3b wala>
SERVICE_ROLE_KEY=<step 3b wala>
SECRET_KEY_BASE=<step 3a wala>
VAULT_ENC_KEY=<step 3a wala>
REALTIME_DB_ENC_KEY=<step 3a wala>
PG_META_CRYPTO_KEY=<step 3a wala>

############ Studio login ############
DASHBOARD_USERNAME=admin
# Isme kam se kam ek letter hona hi chahiye — sirf digits nahi chalenge
DASHBOARD_PASSWORD=<apna strong password>

############ URLs ############
SITE_URL=https://ecoweave.in
API_EXTERNAL_URL=https://api.ecoweave.in
SUPABASE_PUBLIC_URL=https://api.ecoweave.in

############ Analytics ############
# Ye khaali chhode to analytics container crash hota rehta hai
# aur uske saath baaki containers bhi ruk jaate hain
LOGFLARE_PUBLIC_ACCESS_TOKEN=<step 3a wala>
LOGFLARE_PRIVATE_ACCESS_TOKEN=<step 3a wala>

############ Gmail SMTP ############
SMTP_ADMIN_EMAIL=tumhara@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tumhara@gmail.com
SMTP_PASS=<Gmail App Password - step 5>
SMTP_SENDER_NAME=EcoWeave

############ Auth ############
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=false
DISABLE_SIGNUP=false
```

Save: `Ctrl+O`, Enter, `Ctrl+X`

---

## Step 5 — Gmail App Password

Normal Gmail password kaam nahi karega. App Password chahiye:

1. https://myaccount.google.com/security → **2-Step Verification** chalu karo
   (iske bina App Password ka option dikhega hi nahi)
2. https://myaccount.google.com/apppasswords kholo
3. Naam do "EcoWeave Server" → **Create**
4. 16 character ka password milega — usko `SMTP_PASS` mein daalo (spaces
   hata kar)

> Ye password **tum khud** daalna, kisi ko bhejna mat — mujhe bhi nahi.
>
> Gmail ki limit ~500 email/din hai aur wo bulk email ko spam maan sakta
> hai. Shuruaat ke liye theek hai; users badhne par Resend ya Brevo pe
> shift kar lena (`SMTP_HOST` badalna hoga, bas).

---

## Step 6 — Chalao

Supabase ab ek helper script deta hai — ye sahi order mein sab uthata hai:

```bash
cd ~/supabase/docker && sh run.sh start
```

(Ye andar se `docker compose up -d --wait` hi chalata hai.)

Pehli baar mein 5–10 minute lag sakte hain. Status dekho:

```bash
docker compose ps
```

Sab `healthy` ya `running` hone chahiye. Studio kholo: **http://localhost:8000**
(Windows browser se bhi chalega) — `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD`
maangega.

---

## Step 7 — Database schema chalao

Studio → **SQL Editor** → `supabase/schema.sql` ka poora content paste karo →
**Run**. (Wahi file jo cloud ke liye banayi thi, waise hi chalegi.)

Phir khud ko admin banao:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'tumhara@email.com');
```

---

## Step 8 — Next.js app ko jodo

Windows par, `ecoweave-app\.env.local`:

```ini
NEXT_PUBLIC_SUPABASE_URL=https://api.ecoweave.in
NEXT_PUBLIC_SUPABASE_ANON_KEY=<step 3b wala ANON_KEY>
NEXT_PUBLIC_SITE_URL=https://ecoweave.in
```

Local test ke liye `NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000` bhi
chal jayega.

App ka baaki code **bilkul nahi badlega** — self-hosted Supabase wahi API
deta hai jo cloud deta hai.

---

## Step 9 — Caddy se dono domain

> ⛔ **Isse pehle [DEPLOY.md](DEPLOY.md) ke B1–B5 kar lo** (Node, Git,
> code, build, PM2). Caddy ko `localhost:3000` par Next.js chahiye —
> agar wo chal hi nahi raha, to `ecoweave.in` khaali 502 dega.

DNS mein **do** A records banao, dono server ke IP par:

| Type | Name | Value |
|---|---|---|
| A | `@` | server IP |
| A | `api` | server IP |

`C:\caddy\Caddyfile`:

```
ecoweave.in, www.ecoweave.in {
    reverse_proxy localhost:3000
}

api.ecoweave.in {
    reverse_proxy localhost:8000
}
```

```powershell
sc.exe stop caddy; sc.exe start caddy
```

WSL2 ka localhost Windows se apne aap juda hota hai, isliye `localhost:8000`
kaam karta hai.

---

## Step 10 — Server reboot par auto-start

WSL2 boot par khud nahi chalta. Task Scheduler mein entry banao:

```powershell
schtasks /create /tn "Start Supabase" /sc onstart /ru SYSTEM /tr "wsl -d Ubuntu -u root -e sh -c 'service docker start && cd /home/<tumhara-user>/supabase/docker && sh run.sh start'"
```

`<tumhara-user>` apne WSL username se badal dena.

---

## Step 11 — BACKUP (ye mat chhodna)

Cloud par backup automatic hota hai. Yahan **tumhe karna hai**. Server ki
disk gayi to saara data gaya.

Ubuntu mein `~/backup-supabase.sh`:

```bash
#!/bin/bash
mkdir -p ~/backups
docker exec supabase-db pg_dumpall -U postgres \
  | gzip > ~/backups/ecoweave-$(date +%F).sql.gz
find ~/backups -name "*.sql.gz" -mtime +14 -delete
```

```bash
chmod +x ~/backup-supabase.sh && (crontab -l 2>/dev/null; echo "0 2 * * * ~/backup-supabase.sh") | crontab -
```

Roz raat 2 baje backup lega, 14 din purane hata dega.

**Backup ko kabhi-kabhi kisi aur jagah bhi copy karo** (Google Drive, doosra
server). Ek hi machine par pada backup, backup nahi hota.

Restore karna ho to:

```bash
gunzip -c ~/backups/ecoweave-2026-08-21.sql.gz | docker exec -i supabase-db psql -U postgres
```

---

## Security checklist

- [ ] `.env` ki saari default values badli
- [ ] `DASHBOARD_PASSWORD` strong hai
- [ ] Postgres ka port **5432 internet par khula nahi** hai
- [ ] Firewall mein sirf 80 aur 443 khule hain
- [ ] `SERVICE_ROLE_KEY` kahin bhi `NEXT_PUBLIC_` ke saath nahi hai
- [ ] Backup cron chal raha hai aur restore ek baar test kiya hai
- [ ] Har 1–2 mahine `docker compose pull && docker compose up -d`

---

## Kuch atak jaye to

| Problem | Kya karo |
|---|---|
| Containers baar-baar restart | `docker compose logs -f` — aksar `.env` mein koi key khaali ya galat length ki hoti hai |
| `analytics` container crash | `LOGFLARE_*` tokens set kiye? |
| `realtime` / `supavisor` crash | `REALTIME_DB_ENC_KEY` theek 16 aur `VAULT_ENC_KEY` theek 32 character ka hai? |
| Studio nahi khul raha | `docker compose ps` — gateway (envoy) healthy hai? |
| Signup email nahi aa raha | `docker compose logs auth` — Gmail App Password sahi hai? 2FA on hai? |
| App se connect nahi ho raha | `ANON_KEY` wahi hai jo `.env` mein hai? URL sahi hai? |
| `localhost:8000` Windows se nahi khulta | Ubuntu mein `curl localhost:8000` karke dekho; WSL restart: `wsl --shutdown` |
| Sab kuch saaf karke dobara | `docker compose down -v` (⚠️ **poora data mit jaayega**) |
