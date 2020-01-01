import { init, RematchRootState } from "@rematch/core";
import createRematchPersist, { getPersistor } from "@rematch/persist";

import * as models from "./models";

import { sp } from "@/lib/sounds";
import { updateEventActionManager } from "@/lib/actions";
import { comboFilter } from "@/lib/realtime";

const persistPlugin = createRematchPersist({
    version: 1,
    blacklist: ["tempContainer"],
});

export const store = init({
    models,
    plugins: [persistPlugin],
});

export const dispatcher = store.dispatch;

export const persistor = getPersistor();
export type Store = typeof store;
export type Dispatch = typeof store.dispatch;
export type iRootState = RematchRootState<typeof models>;

export const Models = models;

const storeSync = () => {
    const state = store.getState();

    // Restore events
    const events = state.slippi.events;
    updateEventActionManager(events);

    // Restore sound files
    const soundFiles = state.filesystem.soundFiles;
    sp.deserialize(soundFiles);

    // Restore combo settings
    const slippiSettings = state.slippi.settings;
    comboFilter.updateSettings(JSON.parse(slippiSettings));
};

store.subscribe(() => {
    storeSync();
});
