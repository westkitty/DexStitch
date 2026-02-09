import Dexie, { Table } from "dexie";
import type { ProjectData } from "./state";

type ProjectRecord = {
  id: string;
  project: ProjectData;
};

class DexStitchDB extends Dexie {
  projects!: Table<ProjectRecord, string>;

  constructor() {
    super("dexstitch");
    this.version(1).stores({
      projects: "id"
    });
  }
}

const db = new DexStitchDB();
const DEFAULT_ID = "default";

export async function saveProject(project: ProjectData) {
  await db.projects.put({ id: DEFAULT_ID, project });
}

export async function loadProject(): Promise<ProjectData | null> {
  const record = await db.projects.get(DEFAULT_ID);
  return record ? record.project : null;
}
