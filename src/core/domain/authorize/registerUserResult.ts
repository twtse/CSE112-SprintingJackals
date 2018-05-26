import { BaseDomain } from "core/domain/common";

export class RegisterUserResult extends BaseDomain {

  private userId: string;
  constructor (uid: string) {
    super();

    this.userId = uid;
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
}
