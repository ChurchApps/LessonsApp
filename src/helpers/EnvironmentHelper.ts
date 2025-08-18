import { ApiHelper, CommonEnvironmentHelper, Locale } from "@churchapps/apphelper";

export class EnvironmentHelper {
  private static LessonsApi = "";
  static GoogleAnalyticsTag = "";
  static Common = CommonEnvironmentHelper;

  static hasInit = false;

  static init = () => {
    if (this.hasInit) return;

    let stage = process.env.STAGE;
    switch (stage) {
    case "staging":
      EnvironmentHelper.initStaging();
      break;
    case "prod":
      EnvironmentHelper.initProd();
      break;
    default:
      EnvironmentHelper.initDev();
      break;
    }
    EnvironmentHelper.Common.init(stage);

    ApiHelper.apiConfigs = [{ keyName: "MembershipApi", url: EnvironmentHelper.Common.MembershipApi, jwt: "", permissions: [] }, { keyName: "LessonsApi", url: EnvironmentHelper.LessonsApi, jwt: "", permissions: [] }, { keyName: "MessagingApi", url: EnvironmentHelper.Common.MessagingApi, jwt: "", permissions: [] }];

    this.hasInit = true;
  };

  static initLocale = async () => {
    let baseUrl = "https://staging.lessons.church";
    if (typeof window !== "undefined") baseUrl = window.location.origin;
    try {
      await Locale.init([baseUrl + `/apphelper/locales/{{lng}}.json`]);
    } catch (e) {
      console.log("Couldn't init locales", e);
    }
  };

  static initDev = () => {
    this.initStaging();
    EnvironmentHelper.LessonsApi = process.env.NEXT_PUBLIC_LESSONS_API || EnvironmentHelper.LessonsApi;
  };

  //NOTE: None of these values are secret.
  static initStaging = () => {
    EnvironmentHelper.LessonsApi = "https://api.staging.lessons.church";
  };

  //NOTE: None of these values are secret.
  static initProd = () => {
    EnvironmentHelper.LessonsApi = "https://api.lessons.church";
    EnvironmentHelper.Common.GoogleAnalyticsTag = "G-JQWWX8YS7F";
  };
}
