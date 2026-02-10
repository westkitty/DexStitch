import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
/**
 * Real-time collaboration manager using Yjs + WebRTC
 * Enables peer-to-peer sync of design data without server
 */
export class CollaborationManager {
    constructor(roomName = "dexstitch-collab") {
        this.roomName = roomName;
        this.provider = null;
        this.yProject = null;
        this.statusCallback = null;
        this.doc = new Y.Doc();
    }
    /**
     * Initialize collaboration and connect to peers
     */
    async connect(onStatusChange) {
        if (onStatusChange) {
            this.statusCallback = onStatusChange;
        }
        // Create a Y.Map to store project data
        this.yProject = this.doc.getMap('project');
        // Initialize WebRTC provider for P2P sync
        this.provider = new WebrtcProvider(this.roomName, this.doc);
        // Track connection status
        this.provider.on('status', (event) => {
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
    syncProjectToY(project) {
        if (!this.yProject)
            return;
        this.doc.transact(() => {
            // Stringify complex objects for storage in Y.Map
            this.yProject.set('measurements', JSON.stringify(project.measurements));
            this.yProject.set('patternSpec', JSON.stringify(project.patternSpec));
            if (project.pattern) {
                this.yProject.set('pattern', JSON.stringify(project.pattern));
            }
            if (project.nesting) {
                this.yProject.set('nesting', JSON.stringify(project.nesting));
            }
            this.yProject.set('timestamp', Date.now().toString());
        });
    }
    /**
     * Get current shared project state from CRDT
     */
    getProjectFromY() {
        if (!this.yProject)
            return {};
        try {
            return {
                measurements: JSON.parse(this.yProject.get('measurements') || '{}'),
                patternSpec: JSON.parse(this.yProject.get('patternSpec') || '{}'),
                pattern: JSON.parse(this.yProject.get('pattern') || 'null'),
                nesting: JSON.parse(this.yProject.get('nesting') || 'null')
            };
        }
        catch {
            return {};
        }
    }
    /**
     * Subscribe to project changes from peers
     */
    onProjectChange(callback) {
        if (!this.yProject)
            return () => { };
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
    setLocalAwareness(data) {
        if (!this.provider)
            return;
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
    getRemoteAwareness() {
        if (!this.provider)
            return [];
        const awareness = this.provider.awareness;
        const states = awareness.getStates();
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
    disconnect() {
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
    isConnected() {
        return this.provider?.connected ?? false;
    }
    /**
     * Get number of connected peers
     */
    getPeerCount() {
        if (!this.provider)
            return 0;
        try {
            const awareness = this.provider.awareness;
            // Count unique peers from the awareness states
            return (awareness.getStates()?.size ?? 0) - 1; // Subtract self
        }
        catch {
            return 0;
        }
    }
}
/**
 * Create a collaboration manager instance
 * Use this factory to manage a single shared session
 */
export function createCollaborationManager(roomName) {
    return new CollaborationManager(roomName);
}
