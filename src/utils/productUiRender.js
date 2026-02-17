import DATA from '../config/productUiData';

export const renderUITag = (productTag, category) => {
	if (!Array.isArray(productTag)) return null;

	// 符合 category 的 tag data 列表
	const tagDataList = DATA[category]?.flavor;
	const result = [];
	for (const dataTag of tagDataList) {
		for (const UITag of productTag) {
			if (dataTag.value === UITag) {
				result.push(dataTag.img);
			}
		}
	}
	// 將 result 陣列用｜隔開組成字串
	return result;
};
export const renderUITab = (productTab, category) => {
	if (!Array.isArray(productTab)) return null;

	// 符合 category 的 tab data 列表
	const tabDataList = DATA[category]?.tab;
	const result = [];

	for (const dataTab of tabDataList) {
		for (const UITab of productTab) {
			if (dataTab.value === UITab) {
				result.push(dataTab.label);
			}
		}
	}
	// 將 result 陣列用｜隔開組成字串
	return result;
};
