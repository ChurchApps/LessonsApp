import { ArrayHelper, CustomizationInterface } from ".";

export class CustomizationHelper {
  static applyCustomSort = (customizations: CustomizationInterface[], array: any[], contentType: string) => {
    if (!customizations || customizations.length === 0) return array;
    const contentItems = ArrayHelper.getAll(customizations, "contentType", contentType);
    const sortItems = ArrayHelper.getAll(contentItems, "action", "sort");
    if (!sortItems) {
      return array;
    } else {
      const result = [...array];
      result.forEach((item: any) => {
        const cust = ArrayHelper.getOne(sortItems, "contentId", item.id);
        if (cust) item.sort = parseFloat(cust.actionContent);
      });

      return result.sort((a: any, b: any) => {
        if (a.sort < b.sort) return -1;
        else return 1;
      });
    }
  };
}
