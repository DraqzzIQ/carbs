import * as Application from "expo-application";

export function isUpdateAvailable(): boolean {
  const currentVersion = Application.nativeApplicationVersion;
  if (currentVersion === null) {
    return false;
  }

  fetch("https://api.github.com/repos/draqzziq/carbs/releases/latest")
    .then((response) => response.json())
    .then((data) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const latestVersion: string = data.tag_name;
      if (!latestVersion) {
        console.error("Could not fetch latest version.");
        return false;
      }
      if (isRemoteNewer(latestVersion, currentVersion)) {
        console.info(
          `Update available: ${currentVersion} -> ${latestVersion}. Please update the app.`,
        );
        return true;
      } else {
        console.info("App is up to date.");
        return false;
      }
    })
    .catch((error) => {
      console.error("Error checking for updates:", error);
    });
  return false;
}

function isRemoteNewer(remote: string, local: string): boolean {
  if (remote.startsWith("v")) {
    remote = remote.slice(1);
  }

  const [remoteBase] = remote.split("-");

  const remoteParts = remoteBase.split(".").map(Number);
  const localParts = local.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if ((remoteParts[i] || 0) > (localParts[i] || 0)) return true;
    if ((remoteParts[i] || 0) < (localParts[i] || 0)) return false;
  }

  return false;
}
