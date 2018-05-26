import { BaseDomain } from "core/domain/common";

export class LoginUser extends BaseDomain {

  constructor (
     private userId: string,
     private userEmailVerified: boolean,
     private userProviderId: string = "",
     private userDisplayName: string = "",
     private userEmail: string = "",
     private userAvatarURL: string = ""

    ) {
    super();
  }

    /**
     * User identifier
     *
     * @type {string}
     * @memberof LoginUser
     */
  public get uid (): string {
    return this.userId;
  }

  /**
   * If user's email is verifide {true} or not {false}
   *
   * @readonly
   * @type {boolean}
   * @memberof LoginUser
   */
  public get emailVerified (): boolean {
    return this.userEmailVerified;
  }

  public get providerId (): string {
    return this.userProviderId;
  }

  public get displayName (): string {
    return this.userDisplayName;
  }

  public get email (): string {
    return this.userEmail;
  }

  public get avatarURL (): string {
    return this.userAvatarURL;
  }

}
