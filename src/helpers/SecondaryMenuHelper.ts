import { Locale } from "@churchapps/apphelper";

interface MenuItem {
  url: string;
  label: string;
}

export class SecondaryMenuHelper {

  static getSecondaryMenu = (path:string, data:any) => {
    let result:{menuItems:MenuItem[], label:string} = {menuItems:[], label:""};


    //if (path.startsWith("/portal"))
    result = this.getPortalMenu(path);
    //else if (path===("/")) result = this.getDashboardMenu(path);
    return result;
  }

  static getPortalMenu = (path:string) => {
    const menuItems:MenuItem[] = []
    let label:string = "";
    menuItems.push({url: "/portal", label: Locale.label("Schedules") });
    menuItems.push({url: "/portal/thirdParty", label: Locale.label("External Providers") });

    if (path.startsWith("/portal/thirdParty")) label = Locale.label("External Providers");
    if (path==="/portal") label = Locale.label("Schedules");


    return {menuItems, label};
  }

}
