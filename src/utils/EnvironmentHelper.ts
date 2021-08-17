import { ApiHelper } from "./index";

export class EnvironmentHelper {
  private static AccessApi = "";
  private static LessonsApi = "";

  static ContentRoot = "";
  static AccountsAppUrl = "";
  static ChurchAppsUrl = "";
  static GoogleAnalyticsTag = "";

  static init = () => {
    switch (process.env.STAGE) {
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
    ApiHelper.apiConfigs = [
      {
        keyName: "AccessApi",
        url: EnvironmentHelper.AccessApi,
        jwt: "",
        permisssions: [],
      },
      {
        keyName: "LessonsApi",
        url: EnvironmentHelper.LessonsApi,
        jwt: "",
        permisssions: [],
      },
    ];
  };

  static initDev = () => {
    EnvironmentHelper.AccessApi = process.env.NEXT_PUBLIC_ACCESS_API || "";
    EnvironmentHelper.LessonsApi = process.env.NEXT_PUBLIC_LESSONS_API || "";
    EnvironmentHelper.ContentRoot = process.env.NEXT_PUBLIC_CONTENT_ROOT || "";
    EnvironmentHelper.AccountsAppUrl =
      process.env.NEXT_PUBLIC_ACCOUNTS_APP_URL || "";
    EnvironmentHelper.ChurchAppsUrl =
      process.env.NEXT_PUBLIC_CHURCH_APPS_URL || "";
    EnvironmentHelper.GoogleAnalyticsTag =
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || "";
  };

  //NOTE: None of these values are secret.
  static initStaging = () => {
    EnvironmentHelper.AccessApi = "https://accessapi.staging.churchapps.org";
    EnvironmentHelper.LessonsApi = "https://api.staging.lessons.church";
    EnvironmentHelper.ContentRoot = "https://content.staging.churchapps.org";
    EnvironmentHelper.AccountsAppUrl =
      "https://accounts.staging.churchapps.org";
    EnvironmentHelper.ChurchAppsUrl = "https://staging.churchapps.org";
    EnvironmentHelper.GoogleAnalyticsTag = "";
  };

  //NOTE: None of these values are secret.
  static initProd = () => {
    EnvironmentHelper.AccessApi = "https://accessapi.churchapps.org";
    EnvironmentHelper.LessonsApi = "https://api.lessons.church";
    EnvironmentHelper.ContentRoot = "https://content.churchapps.org";
    EnvironmentHelper.AccountsAppUrl = "https://accounts.churchapps.org";
    EnvironmentHelper.ChurchAppsUrl = "https://churchapps.org";
    EnvironmentHelper.GoogleAnalyticsTag = "";
  };
}
