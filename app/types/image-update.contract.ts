import type { Asserts } from "yup";
import * as yup from "yup";
import type { Image } from "~/types/image.model";


export const imageUpdateSchema = yup.object({
    name: yup.string().required('Image name is required'),
});


export type ImageUpdateDto = Asserts<typeof imageUpdateSchema>


export type ImageUpdateResult = Image | undefined

export type ImageUpdateModalResult =
    | { action: 'cancel' }
    | { action: 'confirm'; image: Image }
