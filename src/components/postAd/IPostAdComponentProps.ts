import {Profile} from "core/domain/users";

export interface IPostAdComponentProps {

    /**
     * Current user profile
     */
    currentUser?: Profile;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Styles
     */
    imgUrl?: string;

    /**
     * Translate to locale string
     */
    translate?: (state: any, param?: {}) => any;

    /**
     * Hide feedback form
     */
    hidePostAd?: () => any;

    /**
     * Reset the url for ad image
     */
    resetAdImgUrl?: () => any;

    /**
     * Upload image to the server
     *
     * @memberof IImageGalleryComponentProps
     */
    uploadImage?: (image: any, imageName: string) => any;
}
