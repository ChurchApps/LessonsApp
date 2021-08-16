import { ApiHelper } from "./ApiHelper"
import { UserInterface, ChurchInterface, UserContextInterface, IPermission, LoginResponseInterface } from "../interfaces";

export class UserHelper {
  static currentChurch: ChurchInterface;
  static churches: ChurchInterface[];
  static user: UserInterface;
  static churchChanged: boolean = false;


  static async loginAsGuest(loginResponse: LoginResponseInterface) {
    /**
       * The api for fetching church (/churches/select) requires jwt.
       * Jwt is used only to check who the user is and not to check if he/she
       * belongs to the church, that's why we setup ApiHelper with whatever
       * church the user is already part of cause it doesn't matter,
       * the jwt is used only to find user details.
       */
    if (loginResponse.churches.length > 0) {
      const currentChurch = loginResponse.churches[0];
      UserHelper.setupApiHelper(currentChurch);
    } else {
      UserHelper.setupApiHelperNoChurch(loginResponse.user)
    }
    const keyName = window.location.hostname.split(".")[0];
    let church: ChurchInterface = await ApiHelper.post("/churches/select", { subDomain: keyName }, "AccessApi");

    //Get or create a Person record
    const personData: { person: any, encodedPerson: string } = await ApiHelper.get("/people/claim/" + church.id, "MembershipApi");
    //Associate that person with this user for this church
    await ApiHelper.post("/userchurch/claim", { encodedPerson: personData.encodedPerson }, "AccessApi");
    //Refetch this church's data
    church = await ApiHelper.post("/churches/select", { subDomain: keyName }, "AccessApi");

    UserHelper.churches.push(church);


    return { church: church, person: personData.person };
  }

  static selectChurch = (context: UserContextInterface, churchId?: string, keyName?: string) => {
    let church = null;

    if (churchId) UserHelper.churches.forEach(c => { if (c.id === churchId) church = c; });
    else if (keyName) UserHelper.churches.forEach(c => { if (c.subDomain === keyName) church = c; });
    else church = UserHelper.churches[0];
    if (!church) return;
    else {
      UserHelper.currentChurch = church;
      UserHelper.setupApiHelper(UserHelper.currentChurch);
      if (context.churchName !== "") UserHelper.churchChanged = true;
      context.setChurchName(UserHelper.currentChurch.name);
    }
  }

  static setupApiHelper(church: ChurchInterface) {
    ApiHelper.setDefaultPermissions(church.jwt);
    church.apis.forEach(api => { ApiHelper.setPermissions(api.keyName, api.jwt, api.permissions); });
  }

  static setupApiHelperNoChurch(user: UserInterface) {
    ApiHelper.setDefaultPermissions(user.jwt);
  }

  static checkAccess({ api, contentType, action }: IPermission): boolean {
    const permissions = ApiHelper.getConfig(api).permisssions;

    let result = false;
    if (permissions !== undefined) {
      permissions.forEach(element => {
        if (element.contentType === contentType && element.action === action) result = true;
      });
    }
    return result;
  }

}

