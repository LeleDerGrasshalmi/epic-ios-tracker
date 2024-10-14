import { execSync } from 'child_process';
import fs from 'fs';
import fsp, { writeFile } from 'fs/promises';

import env from './utils/env.js';
import getAltstoreSource from './utils/get-altstore-source.js';
import getAppManifest from './utils/get-app-manifest.js';

import type { App, Version } from './types/altstore-source.js';
import getMarketplaceKit from './utils/get-marketplace-kit.js';
import getAppSize from './utils/get-app-size.js';
import getMarketplaceDownloads from './utils/get-marketplace-downloads.js';
import getAppBaseDownloadUrl from './utils/get-app-base-download-url.js';

const outputFolder = 'output';
const appsFolder = `${outputFolder}/apps`;
const altstoreSourceFile = `${outputFolder}/altstore-source.json`;
const marketplaceKitFile = `${outputFolder}/marketplace-kit.json`;

interface AppChangelog {
  app: {
    name: string;
    bundleId: string;
    thumbnailURL: string | null;
    iconURL: string | null;
    appleItemId: string;
  };
  addedVersions: Version[];
}

const main = async () => {
  if (!fs.existsSync(outputFolder)) {
    await fsp.mkdir(outputFolder, { recursive: true });
  }

  const altstoreSource = await getAltstoreSource();
  const marketplaceKit = await getMarketplaceKit();

  const changelog: AppChangelog[] = [];

  if (altstoreSource.success) {
    await writeFile(altstoreSourceFile, JSON.stringify(altstoreSource.data, null, 3));

    for (let i = 0; i < altstoreSource.data.apps.length; i += 1) {
      const app = altstoreSource.data.apps[i];
      const appBundleId = app.bundleIdentifier.toLowerCase();
      const appFolder = `${appsFolder}/${appBundleId}`;

      const appChangelog: AppChangelog = {
        app: {
          name: app.name,
          bundleId: appBundleId,
          thumbnailURL: app.iconURL,
          iconURL: app.screenshots[0]?.imageURL || null,
          appleItemId: app.marketplaceID,
        },
        addedVersions: [],
      };

      for (let j = 0; j < app.versions.length; j += 1) {
        const versionDetails = app.versions[j];
        const versionManifest = await getAppManifest(versionDetails.downloadURL, versionDetails.version);

        if (versionManifest.success) {
          const appFile = `${appFolder}/${versionDetails.version}.json`;
          const appLatestFile = `${appFolder}/latest.json`;

          if (!fs.existsSync(appFolder)) {
            await fsp.mkdir(appFolder, { recursive: true });
          }

          if (!fs.existsSync(appFile)) {
            appChangelog.addedVersions.push(versionDetails);
          }

          await writeFile(appFile, JSON.stringify({
            meta: versionDetails,
            manifest: versionManifest.data,
          }, null, 3));

          if (j === 0) {
            await writeFile(appLatestFile, JSON.stringify({
              meta: versionDetails,
              manifest: versionManifest.data,
            }, null, 3));
          }
        }
      }

      if (appChangelog.addedVersions.length > 0) {
        changelog.push(appChangelog);
      }
    }
  }

  if (marketplaceKit.success) {
    await writeFile(marketplaceKitFile, JSON.stringify(marketplaceKit.data, null, 3));

    const appleItemIds = Object.keys(marketplaceKit.data.overridesByAppleItemID);
    const marketplaceDownloads = await getMarketplaceDownloads(appleItemIds);

    if (marketplaceDownloads.success) {
      for (let i = 0; i < appleItemIds.length; i += 1) {
        const appleItemId = appleItemIds[i];
        const update = marketplaceDownloads.data.updates.find((x) => x.appleItemId === appleItemId);
        const failure = marketplaceDownloads.data.failures.find((x) => x.appleItemId === appleItemId);

        if (update) {
          const downloadURL = getAppBaseDownloadUrl(update.alternativeDistributionPackage);
          const manifest = await getAppManifest(downloadURL, update.shortVersionString);

          if (manifest.success) {
            const appBundleId = manifest.data.bundleId.toLowerCase();
            const appFolder = `${appsFolder}/${appBundleId}`;
            const appFile = `${appFolder}/${update.shortVersionString}.json`;
            const appLatestFile = `${appFolder}/latest.json`;

            const versionDetails: Version = {
              version: update.shortVersionString,
              date: manifest.date || '',
              localizedDescription: '',
              downloadURL,
              size: manifest.data.variants[0]?.variantDetails?.uncompressedSize || -1,
              minOSVersion: manifest.data.minimumSystemVersions.ios,
              buildVersion: manifest.data.bundleVersion
            };

            if (!fs.existsSync(appFolder)) {
              await fsp.mkdir(appFolder, { recursive: true });
            }

            if (!fs.existsSync(appFile)) {
              changelog.push({
                app: {
                  name: appBundleId,
                  bundleId: appBundleId,
                  thumbnailURL: null,
                  iconURL: null,
                  appleItemId: appleItemId,
                },
                addedVersions: [versionDetails],
              })
            }

            await writeFile(appFile, JSON.stringify({
              meta: versionDetails,
              manifest: manifest.data,
            }, null, 3));

            await writeFile(appLatestFile, JSON.stringify({
              meta: versionDetails,
              manifest: manifest.data,
            }, null, 3));
          }
        } else if (failure) {
          console.warn(`app '${appleItemId}' is not available - ${failure.failure.code}: ${failure.failure.description}`);
        }
      }
    }
  }

  const gitStatus = execSync('git status')?.toString('utf-8') || '';
  let commitMessage = '';

  if (changelog.length > 0) {
    commitMessage = `Added ${changelog.map((x) => `${x.app.name} ${x.addedVersions.map((v) => `v${v.version}`).join(' ')}`).join(', ')}`;
  } else if (gitStatus.includes(altstoreSourceFile)) {
    commitMessage = 'Modified Altstore Source';
  }

  if (gitStatus.includes(marketplaceKitFile)) {
    if (commitMessage.length) {
      commitMessage += ', ';
    }

    commitMessage += 'Modified Marketplace Kit';
  }

  if (!commitMessage.length) {
    return;
  }

  console.info(commitMessage);

  if (env.GIT_DO_NOT_SEND_WEBHOOK?.toLowerCase() !== 'true'
    && env.WEBHOOK_URL
    && URL.canParse(env.WEBHOOK_URL)
    && changelog.length
  ) {
    const webhookRes = await fetch(env.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: changelog.map(({ app, addedVersions }) => ({
          title: app.name,
          thumbnail: app.thumbnailURL && {
            url: app.thumbnailURL,
          },
          image: app.iconURL && {
            url: app.iconURL,
          },
          footer: {
            text: `${app.bundleId} / ${app.appleItemId}`,
          },
          fields: addedVersions.map((x) => ({
            name: `v${x.version} / ${x.buildVersion}`,
            value: `Uncompressed Size: \`${getAppSize(x.size)}\`\nDate: <t:${Math.round(Date.parse(x.date) / 1000)}>`,
          })),
        })),
      }),
    });

    if (!webhookRes.ok) {
      console.error(`failed to send discord webhook: status ${webhookRes.status} ${webhookRes.statusText}: ${await webhookRes.text()}`)
    }
  }

  if (env.GIT_DO_NOT_COMMIT?.toLowerCase() === 'true') {
    return;
  }

  execSync('git add output');
  execSync('git config user.email "41898282+github-actions[bot]@users.noreply.github.com"');
  execSync('git config user.name "github-actions[bot]"');
  execSync('git config commit.gpgsign false');
  execSync(`git commit -m "${commitMessage}"`);

  if (env.GIT_DO_NOT_PUSH?.toLowerCase() === 'true') {
    return;
  }

  execSync('git push');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
