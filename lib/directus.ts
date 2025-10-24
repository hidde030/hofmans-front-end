import {
    createDirectus,
    readItem,
    readItems,
    rest,
    withToken,
} from '@directus/sdk';

const directus = createDirectus<DirectusSchema>("https://directus-production-306b.up.railway.app").with(rest());

export { directus, readItem, readItems, withToken };
