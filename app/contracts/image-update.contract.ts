import type {Image} from "~/models/Image";
import * as yup from "yup";
import type {Asserts} from "yup";


export const imageUpdateSchema = yup.object({
    name: yup.string().required('Image name is required'),
    description: yup
        .string()
        .max(255, "Image description be at most 255 characters")
        .notRequired()
});


export type ImageUpdateDto = Asserts<typeof imageUpdateSchema>


export type ImageUpdateResult = false | Image
