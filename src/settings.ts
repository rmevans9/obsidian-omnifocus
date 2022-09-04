export interface ObsidianOmnifocusSettings {
  tagToSync: string;
  tagForSynced: string;
  useTagForSelection: boolean;
  markCompletedOnSync: boolean;
  useAdvancedUri: boolean;
}

export const DEFAULT_SETTINGS: ObsidianOmnifocusSettings = {
  tagToSync: "#omnifocus",
  tagForSynced: "#omnifocus-synced",
  useTagForSelection: true,
  markCompletedOnSync: false,
  useAdvancedUri: false,
};
