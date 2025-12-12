import type { Asserts } from "yup";
import * as yup from "yup";
import type { Album } from "~/models/Album";


export const albumInfoSchema = yup.object({
    name: yup.string().required('Album name is required'),

});


export type AlbumUpdateDto = Asserts<typeof albumInfoSchema>


export type AlbumCreateDto = Asserts<typeof albumInfoSchema> & { image_ids?: number[] }


export type AlbumUpdateResult = false | Album

export type AlbumCreateResult = false | Album
