# NFC / QR Contact Card

A single static page that an NFC tag (or QR code) points to. When someone scans the tag and
lands on the page, their phone downloads a **vCard (`.vcf`)** so they can save the contact.
The same `.vcf` works on both iPhone and Android — OS detection only chooses the best
download trigger and the right on-screen instructions.

## Files

| File          | What it is                                                        |
|---------------|-------------------------------------------------------------------|
| `index.html`  | Landing page with the card preview + "Save contact" button        |
| `style.css`   | Styling (mobile-first)                                            |
| `script.js`   | OS detection + auto-download + fallback instructions             |
| `contact.vcf` | The actual contact card                                           |
| `photo.jpg`   | *(optional)* contact/brand photo — falls back to initials if absent |

## 1. Fill in your details

Edit the contact in **two** places so the file and the on-screen preview match:

**`contact.vcf`** — replace the placeholder values:
```
N:Lastname;Firstname;;;
FN:Firstname Lastname
ORG:Company / Brand
TITLE:Role
TEL;TYPE=CELL,VOICE:+46700000000
EMAIL;TYPE=INTERNET:name@example.com
URL:https://example.com
ADR;TYPE=WORK:;;Street 1;City;;12345;Country
```

**`index.html`** — update the matching `name`, `role`, and the three `details` links
(`tel:`, `mailto:`, website).

*(Optional)* Drop a square `photo.jpg` into the folder to show a photo instead of initials.
To embed the photo inside the card itself, add a `PHOTO;ENCODING=b;TYPE=JPEG:<base64>` line
to `contact.vcf`.

## 2. Test locally

```bash
python3 -m http.server 8000
```
Open <http://localhost:8000>. On desktop the auto-download is intentionally skipped — use the
button. Open `contact.vcf` to confirm the fields parse correctly.

## 3. Deploy (free, static)

Any static host works. Easiest options:

- **Netlify** — drag the folder onto <https://app.netlify.com/drop>.
- **GitHub Pages** — push these files to a repo, then Settings → Pages → deploy from branch.
- **Vercel / Cloudflare Pages** — import the repo, no build step needed.

You'll get a URL like `https://your-name.netlify.app`.

## 4. Point your NFC tag / QR at the URL

- **NFC tag**: use an app like *NFC Tools* (iOS/Android) → write a **URL/URI record** with your
  deployed URL.
- **QR code**: generate one for the same URL (any QR generator).

Scan with both an iPhone and an Android phone to confirm the end-to-end flow.

## How the auto-download works

- **iPhone (Safari)**: the page navigates to `contact.vcf`, which opens the native
  "Add Contact" screen.
- **Android (Chrome)**: the page clicks the download link; the user taps the downloaded file
  to import it.
- If a browser blocks the automatic trigger, the **"Save contact" button** does the same thing
  on tap.
