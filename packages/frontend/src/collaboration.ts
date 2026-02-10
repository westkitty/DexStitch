import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import type { ProjectData } from "./state";

/**
 * Real-time collaboration manager using Yjs + WebRTC
 * Enables peer-to-peer sync of design data without server
 */
export class CollaborationManager {
  private doc: Y.Doc;
  private provider: WebrtcProvider | null = null;
  private yProject: Y.Map<any> | null = null;
  private statusCallback: ((status: CollabStatus) => void) | null = null;

  constructor(private roomName: string = "dexstitch-collab") {
    this.doc = new Y.Doc();
  }

  /**
   * Initialize collaboration and connect to peers
   */
  async connect(onStatusChange?: (status: CollabStatus) => void): Promise<void> {
    if (onStatusChange) {
      this.statusCallback = onStatusChange;
    }

    // Create a Y.Map to store project data
    this.yProject = this.doc.getMap('project');

    // Initialize WebRTC provider for P2P sync
    this.provider = new WebrtcProvider(this.roomName, this.doc);

    // Track connection status
    this.provider.on('status', (event: { connected: boolean }) => {
      this.statusCallback?.({
        connected: event.connected,
        status: event.connected ? 'connected' : 'disconnected',
        peers: this.getPeerCount()
      });
    });

    // Initial status update
    this.statusCallback?.({
      connected: this.provider.connected,
      status: this.provider.connected ? 'connected' : 'disconnected',
      peers: this.getPeerCount()
    });
  }

  /**
   * Sync local project data with shared CRDT
   */
  syncProjectToY(project: ProjectData): void {
    if (!this.yProject) return;

    this.doc.transact(() => {
      // Stringify complex objects for storage in Y.Map
      this.yProject!.set('measurements', JSON.stringify(project.measurements));
      this.yProject!.set('patternSpec', JSON.stringify(project.patternSpec));
      if (project.pattern) {
        this.yProject!.set('pattern', JSON.stringify(project.pattern));
      }
      if (project.nesting) {
        this.yProject!.set('nesting', JSON.stringify(project.nesting));
      }
      this.yProject!.set('timestamp', Date.now());
    });
  }

  /**
   * Get current shared project state from CRDT
   */
  getProjectFromY(): Partial<ProjectData> {
    if (!this.yProject) return {};

    try {
      return {
        measurements: JSON.parse(this.yProject.get('measurements') || '{}'),
        patternSpec: JSON.parse(this.yProject.get('patternSpec') || '{}'),
        pattern: JSON.parse(this.yProject.get('pattern') || 'null'),
        nesting: JSON.parse(this.yProject.get('nesting') || 'null')
      };
    } catch {
      return {};
    }
  }

  /**
   * Subscribe to project changes from peers
   */
  onProjectChange(callback: (project: Partial<ProjectData>) => void): () => void {
    if (!this.yProject) return () => {};

    const observeCallback = () => {
      callback(this.getProjectFromY());
    };

    this.yProject.observe(observeCallback);

    // Return unsubscribe function
    return () => {
      this.yProject?.unobserve(observeCallback);
    };
  }

  /**
   * Set local user awareness (cursor position, active view, etc.)
   */
  setLocalAwareness(data: UserAwareness): void {
    if (!this.provider) return;

    const state = {
      user: {
        name: data.userName || 'Anonymous',
        color: data.userColor || '#' + Math.floor(Math.random() * 16777215).toString(16)
      },
      cursor: data.cursor,
      activeView: data.activeView,
      lastUpdate: Date.now()
    };

    this.provider.awareness.setLocalState(state);
  }

  /**
   * Get all other users' awareness info
   */
  getRemoteAwareness(): UserAwareness[] {
    if (!this.provider) return [];

    const awareness = this.provider.awareness;
    const states = awareness.getStates() as Map<number, any>;

    return Array.from(states.entries())
      .filter(([clientID]) => clientID !== awareness.clientID)
      .map(([clientID, state]) => ({
        clientID,
        userName: state?.user?.name || 'Anonymous',
        userColor: state?.user?.color || '#999',
        cursor: state?.cursor,
        activeView: state?.activeView,
        lastUpdate: state?.lastUpdate || 0
      }));
  }

  /**
   * Disconnect from collaboration
   */
  disconnect(): void {
    if (this.provider) {
      this.provider.disconnect();
      this.provider.destroy();
      this.provider = null;
    }
    this.doc.destroy();
  }

  /**
   * Check if connected to peers
   */
  isConnected(): boolean {
    return this.provider?.connected ?? false;
  }

  /**
   * Get number of connected peers
   */
  getPeerCount(): number {
    if (!this.provider) return 0;
    
    try {
      const awareness = this.provider.awareness;
      // Count unique peers from the awareness states
      return (awareness.getStates()?.size ?? 0) - 1; // Subtract self
    } catch {
      return 0;
    }
  }
}

/**
 * Collaboration status information
 */
export interface CollabStatus {
  connected: boolean;
  status: 'connected' | 'disconnected' | 'connecting';
  peers: number;
  activeUsers?: UserAwareness[];
}

/**
 * Information about a remote user
 */
export interface UserAwareness {
  clientID?: unknown;
  userName?: string;
  userColor?: string;
  cursor?: { x: number; y: number };
  activeView?: string;
  lastUpdate?: number;
}

/**
 * Create a collaboration manager instance
 * Use this factory to manage a single shared session
 */
export function createCollaborationManager(roomName?: string): CollaborationManager {
  return new CollaborationManager(roomName);
}
