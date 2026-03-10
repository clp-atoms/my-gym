# 💪 MyGym - Gym Workout Tracker

Una webapp moderna per gestire schede palestra con Nuxt 4, Vue 3, e Supabase. Monitora l'evoluzione dei tuoi carichi nel tempo con statistiche dettagliate.

## Features 🎯

- ✅ Gestione schede di allenamento
- ✅ Aggiunta/modifica esercizi con attrezzo, ripetizioni e peso
- ✅ Monitoraggio evoluzione carichi (frecce up/down)
- ✅ Statistiche dettagliate per scheda
- ✅ Cronologia pesi per ogni esercizio
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode
- ✅ Zero costi di manutenzione (Supabase free tier + Netlify free tier)

## Stack Tecnologico

- **Framework**: Nuxt 4
- **UI**: Vue 3 + Nuxt UI + Tailwind CSS
- **State Management**: Pinia
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Netlify
- **Package Manager**: Bun

## Setup Locale

### 1. Installare Bun (se non già installato)
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Installare dipendenze
```bash
bun install
```

### 3. Configurare Supabase

#### 3.1 Creare un account Supabase
1. Vai su https://supabase.com
2. Registrati con email o GitHub
3. Crea un nuovo progetto

#### 3.2 Copiare le credenziali
Dalla pagina del progetto → Settings → API:
- **Project URL** → `NUXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NUXT_PUBLIC_SUPABASE_ANON_KEY`

#### 3.3 Creare il file `.env.local`
```bash
cp .env.example .env.local
```

Poi modifica `.env.local` con le tue credenziali:
```
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 3.4 Creare schema database

Vai su Supabase → SQL Editor e copia questo SQL:

```sql
-- Schede
CREATE TABLE schede (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descrizione TEXT,
  data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Esercizi
CREATE TABLE esercizi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheda_id UUID NOT NULL REFERENCES schede(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  attrezzo VARCHAR(255) NOT NULL,
  ripetizioni INT NOT NULL DEFAULT 10,
  peso_attuale DECIMAL(5, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cronologia Pesi
CREATE TABLE cronologia_pesi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  esercizio_id UUID NOT NULL REFERENCES esercizi(id) ON DELETE CASCADE,
  peso DECIMAL(5, 2) NOT NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indici per performance
CREATE INDEX idx_esercizi_scheda ON esercizi(scheda_id);
CREATE INDEX idx_cronologia_esercizio ON cronologia_pesi(esercizio_id);
CREATE INDEX idx_cronologia_data ON cronologia_pesi(data);
```

Clicca "Run" per eseguire gli script.

#### 3.5 Abilitare RLS (Row Level Security) - Opzionale

Se vuoi multi-utente con autenticazione, vai in Supabase:

1. Authentication → Providers → Email → Enable
2. Per ogni tabella: Authentication → RLS → Enable RLS

### 4. Avviare sviluppo locale
```bash
bun run dev
```

Apri http://localhost:3000

### 5. Build produzione
```bash
bun run build
bun run preview
```

## Deployment su Netlify

### 1. Preparare il repo
```bash
git add .
git commit -m "Initial commit"
git branch -M main
```

### 2. Pushare su GitHub
```bash
git remote add origin https://github.com/your-username/my-gym.git
git push -u origin main
```

### 3. Connettere Netlify
1. Vai su https://netlify.com
2. Clicca "Add new site" → "Import an existing project"
3. Seleziona GitHub e il repo `my-gym`
4. Build settings:
   - Build command: `bun run build`
   - Publish directory: `.output/public`
5. Environment variables:
   ```
   NUXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
6. Clicca "Deploy site"

Netlify farà automaticamente il deploy quando farai push su main!

## Struttura Progetto

```
my-gym/
├── app/
│   ├── pages/
│   │   ├── index.vue              # Lista schede
│   │   ├── schede/
│   │   │   └── [id].vue           # Dettagli scheda + esercizi
│   │   └── statistiche.vue        # Statistiche globali
│   └── app.vue                    # Layout principale
├── components/                    # Componenti riutilizzabili
├── composables/
│   └── useSupabase.ts             # Configurazione Supabase
├── stores/
│   └── workoutStore.ts            # Pinia store per schede/esercizi
├── assets/
│   └── css/
│       └── main.css               # Tailwind CSS
├── server/
│   └── api/                       # Netlify Functions (opzionale)
├── nuxt.config.ts                 # Configurazione Nuxt
├── netlify.toml                   # Configurazione Netlify
├── .env.example                   # Template variabili ambiente
└── bun.lockb                       # Lock file Bun
```

## Uso dell'App

### 📋 Gestione Schede
1. Clicca "Nuova Scheda" nella home
2. Dagli un nome (es. "Upper Body")
3. Aggiungi una descrizione opzionale
4. Clicca "Crea"

### 🏋️ Aggiungi Esercizi
1. Dalla scheda, clicca "Aggiungi Esercizio"
2. Compila:
   - **Nome**: nome esercizio (es. Panca Piana)
   - **Attrezzo**: attrezzo usato (es. Manubri)
   - **Ripetizioni**: numero reps (es. 10)
   - **Peso**: peso iniziale kg
3. Clicca "Aggiungi"

### ⚖️ Aggiorna Pesi
1. Dalla scheda, clicca "Aggiorna Peso" su un esercizio
2. Inserisci il nuovo peso
3. Vedi il confronto (freccia up 📈 o down 📉)
4. Clicca "Salva"

### 📊 Statistiche
1. Vai a "Statistiche" nel menu
2. Seleziona una scheda
3. Vedi:
   - Numero esercizi
   - Totale peso sollevato
   - Incremento medio
   - Progressione peso per singolo esercizio
   - Cronologia aggiornamenti

## Troubleshooting

### Errore: "NUXT_PUBLIC_SUPABASE_URL not found"
→ Verifica che `.env.local` esista e contenga le variabili corrette

### Errore: "relations "schede" does not exist"
→ Hai dimenticato di creare le tabelle SQL su Supabase. Segui il passo 3.4

### Build fallisce su Netlify
→ Controlla i log di build in Netlify. Verifica che:
- Environment variables siano presenti
- Non ci siano typo nelle credenziali
- Node >= 18 è in uso (Netlify usa Node 18 di default)

## Migliorie Future

- [ ] Autenticazione utenti con Supabase Auth
- [ ] Condivisione schede tra utenti
- [ ] Upload foto per esercizi
- [ ] Reminder per allenamenti
- [ ] API per mobile app
- [ ] Grafico interattivo con Chart.js
- [ ] Export/Import schede (CSV, JSON)
- [ ] Workout in tempo reale con timer

## License

MIT - Libero da usare, modificare e distribuire

## Support

Hai problemi? Controlla:
1. La console del browser (F12)
2. I log di Supabase nella dashboard
3. La documentazione di Nuxt: https://nuxt.com
4. La documentazione di Supabase: https://supabase.com/docs

---

Made with 💪 and ☕
