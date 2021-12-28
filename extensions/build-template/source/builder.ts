
import { IBuildPlugin } from '../@types';

export function load() {
}

export function unload() {
}

export const configs: Record<string, IBuildPlugin> = {
    '*': {
        hooks: 'hooks',
    },
};
