import * as Application from "expo-application";

export async function isUpdateAvailable(): Promise<boolean> {
  const currentVersion = Application.nativeApplicationVersion;
  if (currentVersion === null) {
    return false;
  }

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "carbs/1.0",
  };

  const response = await fetch(
    "https://api.github.com/repos/draqzziq/carbs/releases/latest",
    { headers: headers },
  );
  if (!response.ok) {
    console.error("Failed to fetch latest release info:", response.statusText);
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await response.json();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!data?.tag_name) {
    console.error("Invalid response from GitHub API:", data);
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
