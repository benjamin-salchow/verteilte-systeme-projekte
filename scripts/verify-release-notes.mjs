import { generateNotes } from "@semantic-release/release-notes-generator";

const notes = await generateNotes(
  { preset: "conventionalcommits" },
  {
    commits: [
      {
        hash: "0123456789abcdef0123456789abcdef01234567",
        message: "feat: verify release notes generation",
      },
    ],
    lastRelease: {
      gitHead: "0123456789abcdef0123456789abcdef01234567",
      gitTag: "v1.0.0",
    },
    nextRelease: {
      gitHead: "fedcba9876543210fedcba9876543210fedcba98",
      gitTag: "v1.0.1",
      version: "1.0.1",
    },
    options: {
      repositoryUrl: "https://github.com/benjamin-salchow/verteilte-systeme-projekte.git",
    },
    cwd: process.cwd(),
  },
);

if (!notes.includes("verify release notes generation")) {
  throw new Error("Release notes did not contain the example commit.");
}
