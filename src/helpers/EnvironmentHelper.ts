import { ApiHelper, CommonEnvironmentHelper, Locale } from "@churchapps/apphelper";
import { commonStageFor, lessonsApiFor, SITE_ROOT } from "./environmentStage";

export class EnvironmentHelper {
  private static LessonsApi = "";
  static GoogleAnalyticsTag = "";
  static Common = CommonEnvironmentHelper;

  static hasInit = false;

  static init = () => {
    if (this.hasInit) return;

    // Read each variable by name: Next.js only inlines process.env.X for the browser when X is written out.
    const env = { STAGE: process.env.STAGE, NEXT_PUBLIC_LESSONS_API: process.env.NEXT_PUBLIC_LESSONS_API, NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE };
    //NOTE: None of these values are secret.
    EnvironmentHelper.LessonsApi = lessonsApiFor(env);
    EnvironmentHelper.Common.init(commonStageFor(env));
    if (env.STAGE === "prod") EnvironmentHelper.Common.GoogleAnalyticsTag = "G-JQWWX8YS7F";

    ApiHelper.apiConfigs = [{ keyName: "MembershipApi", url: EnvironmentHelper.Common.MembershipApi, jwt: "", permissions: [] }, { keyName: "LessonsApi", url: EnvironmentHelper.LessonsApi, jwt: "", permissions: [] }, { keyName: "MessagingApi", url: EnvironmentHelper.Common.MessagingApi, jwt: "", permissions: [] }];

    this.hasInit = true;
  };

  static initLocale = async () => {
    let baseUrl = SITE_ROOT;
    if (typeof window !== "undefined") baseUrl = window.location.origin;
    try {
      await Locale.init([baseUrl + `/apphelper/locales/{{lng}}.json`]);
    } catch (e) {
      console.log("Couldn't init locales", e);
    }
  };
}
