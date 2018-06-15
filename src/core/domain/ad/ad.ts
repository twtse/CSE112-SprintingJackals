import { BaseDomain } from "core/domain/common";
export class Ad extends BaseDomain {
    /**
     * Ad identifier
     *
     * @type {string}
     * @memberof Ad
     */
	public id?: string | null;

    /**
     * URL of the ad
     *
     * @type {string}
     * @memberof Ad
     */
	public image?: string;
}
