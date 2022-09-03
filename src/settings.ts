export interface ObsidianOmnifocusSettings {
  tagToSync: string;
  tagForSynced: string;
  markCompletedOnSync: boolean;
}

export const DEFAULT_SETTINGS: ObsidianOmnifocusSettings = {
  tagToSync: "#omnifocus",
  tagForSynced: "#omnifocus-synced",
  markCompletedOnSync: false,
};
