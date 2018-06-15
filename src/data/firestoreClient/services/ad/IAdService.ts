import { Ad } from "core/domain/ad";

export interface IAdService {
    loadAds: () => Promise<Ad[]>;
}
