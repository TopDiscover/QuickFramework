import { IBuildPlugin } from "../@types/packages/builder/@types";

export function load() {
}

export function unload() {
}

export const configs: Record<string, IBuildPlugin> = {
    '*': {
        hooks: 'Hooks',
    },
};