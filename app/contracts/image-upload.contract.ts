import type {Image} from "../models/Image";

export type ImageUploadResponse= {
    uploaded: Image[]
    failed: Array<{ index?: number; name: string; message: string; debug?: string }>
}