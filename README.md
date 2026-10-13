# Branch Notes

A personal mind-map notebook that runs entirely in your browser and installs on your computer like a normal app. No account, no subscription, works offline.

![Branch Notes icon](icons/icon-192.png)

## Features

- **Mind maps with smooth layout.** Branches glide into place when you add, move, collapse or undo.
- **Toolbar on every branch:** style and color, text format (bold, italic, size, color), image, file attachments, link, connection arrow, comments, icons, priority, checkboxes.
- **Images you can resize.** Drag the small square at the image's corner, or use the slider.
- **Connection arrows** between any two boxes, with curves you shape by dragging handles, labels, and direction flip.
- **Free boxes** that aren't attached to the central idea. Double-click empty space to add one.
- **Long notes.** Every branch has its own note, with a full-screen editor and word count.
- **20 themes,** including Terminal (green pixel screen), Classroom (chalkboard with a wooden frame), Notebook and Blueprint, plus 6 line styles.
- **Backups.** Export every map, image and file to one `.json` file, and import it on another computer.
- **Markdown export** and copy-as-outline.

## Run it on your computer

### Option 1: Install from GitHub Pages (recommended)

1. Create a new repository on GitHub, for example `branch-notes`.
2. Upload every file in this folder (keep the `icons` folder).
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
4. After a minute your app is live at `https://YOUR-USERNAME.github.io/branch-notes/`.
5. Open that address in **Chrome** or **Edge** and click **Install app** in the top bar (or the install icon at the right of the address bar).

Branch Notes now has its own window, a desktop or Start menu shortcut, and works without internet.

### Option 2: Run it locally without GitHub

The app needs to be served over `http://` to install and work offline. From this folder run either:

```bash
python -m http.server 8000
# or
npx serve .
```

Then open <http://localhost:8000> in Chrome or Edge and click **Install app**.

Opening `index.html` directly by double-clicking also works for editing, but the browser won't offer to install it that way.

## Sync between your phone and computer

Branch Notes can sync through your own free Firebase project. No credit card is needed: maps, images and files are all stored in Cloud Firestore on the free Spark plan, so the paid Cloud Storage product isn't used.

1. Create a Firebase project and add a **Web app**. Copy its config object.
2. In **Authentication → Sign-in method**, turn on **Google** and **Email/Password**.
3. In **Authentication → Settings → Authorized domains**, add `YOUR-USERNAME.github.io`.
4. Create a **Firestore Database** in production mode and paste the contents of `firestore.rules` into its **Rules** tab, then **Publish**.
5. Edit `firebase-config.js` in your repository and replace `null` with the config object.
6. Open the app, press **Sign in to sync**, and sign in with the same account on every device.

A step-by-step guide in Turkish is in [`FIREBASE-KURULUM.md`](FIREBASE-KURULUM.md).

Free-plan limits: 1 GB stored, 50,000 reads and 20,000 writes a day, 1 MB per map, 15 MB per image or file. Sync keeps working offline and catches up when you're back online. Editing the same map on two devices at the same moment keeps the last saved version.

## Where your data lives

Without sync, maps, images and attachments are stored in your browser's IndexedDB **on that computer**, and nothing is uploaded anywhere. With sync turned on and signed in, they're stored in your Firebase project and cached on each device for offline use.

- There's no fixed size limit: the browser allows a share of your free disk space.
- Clearing your browser's site data for this address deletes your maps. Use **Backup → Export** in the left panel now and then to keep a copy.
- To move maps to another computer, export a backup there and import it here.

## Keyboard shortcuts

| Keys | Action |
| --- | --- |
| `Tab` | Add a child branch |
| `Enter` | Add a sibling branch |
| Start typing | Replace the selected branch's text |
| `F2` or click a selected branch | Edit its text |
| `Delete` | Delete the branch or connection |
| `Space` | Collapse or expand |
| Arrow keys | Move between branches |
| `Alt + ↑ / ↓` | Reorder among siblings |
| `Alt + C` | Connect with an arrow |
| `Ctrl + V` | Paste an image into the selected branch |
| `Ctrl + Z` / `Ctrl + Shift + Z` | Undo / redo |
| `Ctrl + mouse wheel` | Zoom |

## Updating the app

Replace `index.html` with a new version, then open `sw.js` and change the `CACHE` name (for example `branch-notes-v2` to `branch-notes-v3`). Installed copies update the next time they're opened online.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app |
| `manifest.webmanifest` | Name, icons and window style for installing |
| `sw.js` | Offline support |
| `firebase-config.js` | Your Firebase settings for sync (leave `null` to stay on this device) |
| `firestore.rules` | Database rules that keep each person's maps private |
| `vendor/firebase.js` | Firebase SDK 12.19.0, bundled so the app works offline |
| `FIREBASE-KURULUM.md` | Sync setup guide in Turkish |
| `icons/` | App icons |
