import type { Image } from "./image.model";

export type ImageUploadResponse = {
    uploaded: Image[]
    failed: Array<{ index?: number; name: string; message: string; debug?: string }>
}