import { execSync } from 'child_process';
import fs from 'fs';
import fsp, { writeFile } from 'fs/promises';

import env from './utils/env.js';
import getAltstoreSource from './utils/get-altstore-source.js';
import getAppManifest from './utils/get-app-manifest.js';

import type { App, Version } from './types/altstore-source.js';

const outputFolder = 'output';
const appsFolder = `${outputFolder}/apps`;
const altstoreSourceFile = `${outputFolder}/altstore-source.json`;

interface AppChangelog {
  app: App;
  addedVersions: Version[];
}

const main = async () => {
  if (!fs.existsSync(outputFolder)) {
    await fsp.mkdir(outputFolder, { recursive: true });
  }

  const altstoreSource = await getAltstoreSource();

  if (!altstoreSource.success) {
    return;
  }

  await writeFile(altstoreSourceFile, JSON.stringify(altstoreSource.data, null, 3));

  const changelog: AppChangelog[] = [];

  for (let i = 0; i < altstoreSource.data.apps.length; i += 1) {
    const app = altstoreSource.data.apps[i];

    const appChangelog: AppChangelog = {
      app,
      addedVersions: [],
    };

    for (let j = 0; j < app.versions.length; j += 1) {
      const versionDetails = app.versions[j];
      const versionManifest = await getAppManifest(versionDetails);

      if (versionManifest.success) {
        const appBundleId = app.bundleIdentifier.toLowerCase();
        const appFolder = `${appsFolder}/${appBundleId}`;
        const appFile = `${appFolder}/${versionDetails.version}.json`;

        if (!fs.existsSync(appFolder)) {
          await fsp.mkdir(appFolder, { recursive: true });
        }

        if (!fs.existsSync(appFile)) {
          appChangelog.addedVersions.push(versionDetails);
        }

        await writeFile(appFile, JSON.stringify(versionManifest.data, null, 3));
      }
    }

    if (appChangelog.addedVersions.length > 0) {
      changelog.push(appChangelog);
    }
  }

  const gitStatus = execSync('git status')?.toString('utf-8') || '';
  let commitMessage = '';

  if (gitStatus.includes(altstoreSourceFile)) {
    if (changelog.length > 0) {
      commitMessage = `Added ${changelog.map((x) => `${x.app.name} ${x.addedVersions.map((v) => `v${v.version}`).join(' ')}`).join(', ')}`;
    } else {
      commitMessage = 'Modified Altstore Source';
    }
  }

  if (!commitMessage.length) {
    return;
  }

  console.log(commitMessage);

  if (env.GIT_DO_NOT_COMMIT?.toLowerCase() === 'true') {
    return;
  }

  execSync('git add output');
  execSync('git config user.email "github-actions@github.com"');
  execSync('git config user.name "GitHub Actions"');
  execSync('git config commit.gpgsign false');
  execSync(`git commit -m "${commitMessage}"`);

  if (env.GIT_DO_NOT_PUSH?.toLowerCase() === 'true') {
    return;
  }

  execSync('git push');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
