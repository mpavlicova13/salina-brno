# Zámek na appku — co udělat

Appka se přestěhuje z GitHub Pages na **Cloudflare Pages**. Repozitář i způsob práce
zůstávají stejné — pushneš na GitHub a Cloudflare to samo nasadí. Navíc umí spustit
kód na serveru, což je jediný způsob, jak uhlídat, že se kód nepoužije dvakrát.

Počítej zhruba s hodinou, z toho většina je čekání na DNS.

---

## 1. Commit na novou větev

Na `main` to necommituj. GitHub Pages servírují z kořene repozitáře, takže
jakmile by tam přistál přesun do `app/`, salinabrno.fun zhasne a bude tmavé,
dokud Cloudflare nenaběhne. Na větvi se nic takového nestane — starý web
běží z `main` dál, dokud sama nepřepneš.

```bash
git checkout -b cloudflare
git add -A && git commit -m "Move app into app/ and add access gate"
git push -u origin cloudflare
```

Kroky 1 a 2 na sobě nezávisí, můžeš je dělat souběžně.

## 2. Účet a doména

1. Založ si účet na [cloudflare.com](https://dash.cloudflare.com/sign-up) — zdarma.
2. **Websites → Add a site** → `salinabrno.fun`, plán **Free**.
3. Cloudflare ti ukáže dva nameservery. Ty nastav u registrátora, kde máš doménu koupenou.
4. Než se to propíše, může to trvat pár hodin. Mezitím pokračuj dál.

## 3. Úložiště na kódy

**Storage & Databases → KV → Create a namespace**, jméno `salina-kody`.

Zkopíruj si **Namespace ID** a vlož ho do `wrangler.toml` místo `SEM_PRIJDE_ID_Z_KROKU_3`.

## 4. Nahrát kódy

```bash
npx wrangler login
npx wrangler kv bulk put --binding=CODES kody-pro-kv.json --remote
```

Patnáct kódů máš v `kody.json`. Vytiskni si je nebo napiš na lístečky.

## 5. Nasadit na zkoušku

1. **Workers & Pages → Create → Pages → Connect to Git** → vyber `salina-brno`.
2. **Production branch** nastav na `cloudflare` (ne main).
3. Build command nech prázdný, **output directory** nastav na `app`.
4. Po prvním nasazení jdi do **Settings → Bindings**:
   - **KV namespace**: proměnná `CODES` → namespace `salina-kody`
   - **Environment variable**: `ADMIN_KEY` → vymysli si heslo, označ jako **Secret**

Teď to běží na adrese `něco.pages.dev`. Vyzkoušej si tam zámek i admin stránku
dřív, než na to pustíš doménu. Starý web mezitím pořád jede z `main`.

## 6. Přepnout ostrý provoz

Až budeš spokojená:

1. V Pages projektu **Custom domains** → přidej `salinabrno.fun`.
2. Na GitHubu vypni Pages: **Settings → Pages → Source: None**.
3. Sluč větev do main a přepni produkční větev zpátky na `main`:

```bash
git checkout main && git merge cloudflare && git push
```

---

## Jak to pak používat

**Přehled kódů:**
`https://salinabrno.fun/api/admin?key=TVOJE_ADMIN_HESLO`

Vidíš, které kódy jsou volné, které použité, kdy a z jakého zařízení.
Tlačítkem **Uvolnit** vrátíš kód do hry, když se někdo legitimně zasekne.

**Při rozhovoru:** dej kód a nech ho zadat hned, na jeho telefonu, před sebou.
Tím se naváže na správné zařízení a nikdo jiný ho už nepoužije.

---

## Náhledový obrázek

Přihlašovací stránka ukazuje na pozadí rozmazaný screenshot appky.
Ulož ho jako **`app/nahled.png`** — stačí běžný screenshot hlavní obrazovky.
Bez něj bude pozadí jen tmavé, což taky funguje, jen je to méně lákavé.

> Rozmazání je čistě vizuální. Skutečnou ochranu dělá server — bez platného
> kódu se obsah appky do prohlížeče vůbec nepošle.
