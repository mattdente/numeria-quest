# Numeria Quest

A maths adventure for Cambridge Lower Secondary Mathematics Stage 7. There are 16 regions (one per unit) and 66 shrines (one per section). Each shrine has three trials: Warm-up, Practice and Challenge.

## How gems work

- Each trial is 8 questions. The gems for each correct answer depend on the level: Warm-up 5, Practice 10, Challenge 15.
- A trial pays out once, the first time it is finished. After that it can be replayed for practice, with no gems.
- Each missed question can be fixed in a fix-it quest, using a new question of the same kind. A correct fix earns the gems that question was worth.
- A trial that has been started is saved. Leaving and coming back resumes the same questions, so a trial can't be restarted to get easier ones.
- If every trial in the book is finished and fixed, it pays 15,840 gems in total. At the default rate of 100 gems per $1, that is $158.40.

## Parent area

Tap **Parents** and set a 4-digit PIN the first time. In the parent area you can:

- **Gems and cash-outs**: see the balance and pay it out ("Cash out"). This sets the balance to zero and keeps all game progress. Every cash-out is saved in the log.
- **Earning history**: see every trial and fix-it quest, with the date and the gems earned.
- **Progress**: see each unit's trials and what is still to fix.
- **Settings**: change the gem rate, the hero name or the PIN, save or restore a backup, and start over.

All progress is stored only on the device. Use **Save a backup file** now and then.

## Put it on GitHub Pages

1. Create a new repository, for example `numeria-quest`.
2. Upload every file in this folder to the top level of the repository, keeping the folder structure (`css/`, `js/`, `icons/`).
3. In the repository, go to **Settings → Pages**. Set **Source** to "Deploy from a branch", then choose `main` and `/ (root)`.
4. After a minute the site is live at `https://<your-username>.github.io/numeria-quest/`.

## Install on the iPad

Open the site in Safari, tap **Share**, then tap **Add to Home Screen**. It opens full screen and works offline once it has loaded.

## Updating

Replace the files in the repository. The iPad picks up the new version the next time the app opens while online. Progress is not affected.

## Checking the questions

All questions are generated in code, so every answer is calculated rather than typed by hand. To test every section at every level (needs Node 18+):

```
npm test
```
