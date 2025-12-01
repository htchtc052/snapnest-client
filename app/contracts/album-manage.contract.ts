import * as yup from "yup";
import type {Asserts} from "yup";
import type {Album} from "~/models/Album";


export const albumInfoSchema = yup.object({
    name: yup.string().required('Album name is required'),
    description: yup
        .string()
        .max(255, "Album description be at most 255 characters")
        .notRequired()
});


export type AlbumUpdateDto = Asserts<typeof albumInfoSchema>


export type AlbumCreateDto = Asserts<typeof albumInfoSchema>


export type AlbumUpdateResult = false | Album

export type AlbumCreateResult = false | Album
