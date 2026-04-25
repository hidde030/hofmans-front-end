# Datamodel Documentatie: Diensten

Dit document beschrijft de structuur en configuratie van de "Diensten" (Services) collectie binnen Directus CMS die gebruikt wordt voor de frontend.

## Collectie Instellingen
- **Collectienaam**: `diensten` (of `services`)
- **Primary Key**: UUID
- **Singleton**: Nee (we hebben meerdere diensten)

## Velden

| Veldnaam | Type in Directus | Interface / Weergave | Beschrijving | Verplicht? |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | Standaard | Unieke identifier van de dienst. | Ja |
| `status` | String | Dropdown / Status | Bepaalt de zichtbaarheid (`published`, `draft`, `archived`). | Ja |
| `sort` | Integer | Sorteren | Bepaalt de volgorde van de diensten in overzichten. | Nee |
| `user_created` | UUID | Standaard | Gebruiker die de dienst heeft aangemaakt. | Nee |
| `date_created` | Timestamp | Standaard | Datum en tijd van aanmaken. | Nee |
| `user_updated` | UUID | Standaard | Gebruiker die de dienst het laatst heeft bewerkt. | Nee |
| `date_updated` | Timestamp | Standaard | Datum en tijd van de laatste bewerking. | Nee |
| `title` | String | Input | De weergavenaam van de dienst. | Ja |
| `description` | Text | WYSIWYG / Textarea | De uitgebreide beschrijving van de dienst. | Nee |
| `image` | UUID (File) | Image | Visualisatie / header afbeelding van de dienst. | Nee |
| `slug` | String | Input (Auto Generate) | URL-vriendelijke variant van de titel (bijv. voor `/diensten/naam-van-dienst`). | Ja |

## TypeScript Definitie (Frontend)

De bijbehorende TypeScript interface voor de frontend (bijvoorbeeld toe te voegen in `src/types/directus-schema.ts`):

```typescript
export interface Diensten {
  id: string;
  status: 'published' | 'draft' | 'archived';
  sort: number | null;
  user_created: string | null;
  date_created: string | null;
  user_updated: string | null;
  date_updated: string | null;
  
  // Custom velden
  title: string;
  description: string;
  image: string | DirectusFiles | null; // UUID of het Image object als fields=* is meegegeven
  slug: string;
}

// Verrijking van de basis schema
export interface Schema {
  // ... andere collecties
  diensten: Diensten[];
}
```

## Gebruik & Implementatie details
- Bij het ophalen van de diensten vanuit de frontend moet vaak de image genest of via query params uitgevraagd worden (bijv. `?fields=*,image.*`) als de meta-data van de afbeelding nodig is in plaats van enkel het ID.
- Gebruik de `slug` eigenschap voor de client-side routing.
