import type { SanctumClient } from "~/http/sanctum/sanctum-client.type";
import type { Album } from "~/types/album.model";

export async function albumDelete(client: SanctumClient, id: Album['id']): Promise<void> {
  await client(`/api/account/albums/${id}`, { method: 'DELETE' })
}
