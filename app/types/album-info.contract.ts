import type { Asserts } from "yup";
import * as yup from "yup";
export const albumInfoSchema = yup.object({
    name: yup.string().required('Album name is required'),
});


export type AlbumUpdateDto = Asserts<typeof albumInfoSchema>

