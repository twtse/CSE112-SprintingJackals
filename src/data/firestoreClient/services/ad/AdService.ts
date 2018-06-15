import { Ad } from "core/domain/ad";

// - Import react components
import { firebaseRef, firebaseAuth, db } from "data/firestoreClient";

import { IAdService } from "./IAdService";
import { injectable } from "inversify";
/**
 * Firbase Ad service
 *
 * @export
 * @class AdService
 * @implements {IAdService}
 */
@injectable()
export class AdService implements IAdService {
    loadAds(): Promise<Ad[]> {
        return new Promise(async (resolve, reject) => {
            const ads = (await db.collection("advertisement").get()).docs;
            let adArray = [] as Ad[];

            ads.forEach(ad => {
                adArray.push({
                    id: ad.id,
                    image: ad.get("URL")
                });
            });

            resolve(adArray);
        });
    }
}
