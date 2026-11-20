import { ArrayHelper, CustomizationInterface } from ".";

export class CustomizationHelper {
  static applyCustomSort = <T extends { id?: string; sort?: number }>(customizations: CustomizationInterface[], array: T[], contentType: string) => {
    if (!customizations || customizations.length === 0) return array;
    const contentItems = ArrayHelper.getAll(customizations, "contentType", contentType);
    const sortItems = ArrayHelper.getAll(contentItems, "action", "sort");
    if (!sortItems) {
      return array;
    } else {
      const result = [...array];
      result.forEach((item: T) => { const cust = ArrayHelper.getOne(sortItems, "contentId", item.id); if (cust) item.sort = parseFloat(cust.actionContent); });

      return result.sort((a: T, b: T) => { if (Number(a.sort) < Number(b.sort)) return -1; else return 1; });
    }
  };
}
