/**
 * Custom type extensions for collections/blocks that are not yet in the
 * auto-generated directus-schema.ts. Import from this file instead of
 * editing directus-schema.ts directly.
 */
import type { DirectusUser, DirectusFile, ExtensionSeoMetadata, Schema } from './directus-schema';

export interface Project {
	/** @primaryKey */
	id: string;
	status?: 'published' | 'draft' | 'archived';
	sort?: number | null;
	user_created?: DirectusUser | string | null;
	date_created?: string | null;
	user_updated?: DirectusUser | string | null;
	date_updated?: string | null;
	/** @required */
	title: string;
	description?: string | null;
	image?: DirectusFile | string | null;
	slug?: string | null;
	seo?: ExtensionSeoMetadata | null;
}

export interface BlockAllServices {
	/** @primaryKey */
	id: string;
	headline?: string | null;
}

export interface BlockRelatedProjects {
	/** @primaryKey */
	id: string;
	headline?: string | null;
	projects?: BlockRelatedProjectsProject[] | string[];
}

export interface BlockRelatedProjectsProject {
	/** @primaryKey */
	id: string;
	block_related_projects_id?: BlockRelatedProjects | string | null;
	projects_id?: Project | string | null;
	sort?: number | null;
}

/**
 * Extends the generated Schema with custom collections so the Directus SDK
 * remains properly typed for these new collections.
 */
export interface ExtendedSchema extends Schema {
	projects: Project[];
	block_all_services: BlockAllServices[];
	block_related_projects: BlockRelatedProjects[];
	block_related_projects_projects: BlockRelatedProjectsProject[];
}
