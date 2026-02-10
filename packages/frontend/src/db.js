import Dexie from "dexie";
class DexStitchDB extends Dexie {
    constructor() {
        super("dexstitch");
        this.version(1).stores({
            projects: "id"
        });
    }
}
const db = new DexStitchDB();
const DEFAULT_ID = "default";
export async function saveProject(project) {
    await db.projects.put({ id: DEFAULT_ID, project });
}
export async function loadProject() {
    const record = await db.projects.get(DEFAULT_ID);
    return record ? record.project : null;
}
