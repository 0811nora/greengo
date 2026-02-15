import seafoodTag from '../assets/image/product/seafood.svg';
import beefTag from '../assets/image/product/beef.svg';
import coffeeTag from '../assets/image/product/coffee.svg';
import alcoholTag from '../assets/image/product/alcohol.svg';
import milkTag from '../assets/image/product/milk.svg';
import spicyTag from '../assets/image/product/spicy.svg';
import sugarTag from '../assets/image/product/sugar.svg';

const productUiData = {
	set: {
		category: 'set',
		title: {
			icon: 'allergies',
			title: '經典綠果碗',
			subtitle: '由主廚精心搭配的營養組合',
		},
		sort: [
			{ value: 'proteinToLow', label: '蛋白：高 → 低' },
			{ value: 'kcalToHigh', label: '熱量：低 → 高' },
			{ value: 'likeToLow', label: '人氣：高 → 低' },
			{ value: 'priceToHigh', label: '價格：低 → 高' },
			{ value: 'priceToLow', label: '價格：高 → 低' },
		],
		tab: [
			{ value: 'all', label: '全部', icon: 'border_all' },
			{ value: 'popular', label: '人氣推薦', icon: 'thumb_up' },
			{ value: 'highProtein', label: '多多蛋白', icon: 'egg' },
			{ value: 'lowFat', label: '低卡低脂', icon: 'favorite' },
			{ value: 'veg', label: '新鮮蔬食', icon: 'nest_eco_leaf' },
		],
		flavor: [
			{ value: 'beef', label: '不含牛肉', img: beefTag },
			{ value: 'pork', label: '不含豬肉' },
			{ value: 'seafood', label: '不含海鮮', img: seafoodTag },
			{ value: 'spicy', label: '不辣', img: spicyTag },
		],
	},
	drinks: {
		category: 'drinks',
		title: {
			icon: 'local_cafe',
			title: '健康飲品',
			subtitle: '讓營養更完整的健康飲品',
		},
		sort: [
			{ value: 'likeToLow', label: '人氣：高 → 低' },
			{ value: 'priceToHigh', label: '價格：低 → 高' },
			{ value: 'priceToLow', label: '價格：高 → 低' },
		],
		tab: [
			{ value: 'all', label: '全部' },
			{ value: 'tea', label: '鮮茶' },
			{ value: 'coffee', label: '咖啡' },
			{ value: 'juice', label: '果汁' },
		],
		flavor: [
			{ value: 'alcohol', label: '無酒精', img: alcoholTag },
			{ value: 'caffeine', label: '無咖啡因', img: coffeeTag },
			{ value: 'sugar', label: '無糖', img: sugarTag },
		],
	},
	soup: {
		category: 'soup',
		title: {
			icon: 'soup_kitchen',
			title: '溫暖湯品',
			subtitle: '讓營養更均衡的溫暖湯品',
		},

		sort: [
			{ value: 'likeToLow', label: '人氣：高 → 低' },
			{ value: 'priceToHigh', label: '價格：低 → 高' },
			{ value: 'priceToLow', label: '價格：高 → 低' },
		],
		tab: [
			{ value: 'all', label: '全部' },
			{ value: 'freshSoup', label: '清爽湯' },
			{ value: 'proteinSoup', label: '高蛋白湯' },
			{ value: 'vegSoup', label: '素食湯' },
		],
		flavor: [
			{ value: 'beef', label: '不含牛肉', img: beefTag },
			{ value: 'daily', label: '不含奶', img: milkTag },
		],
	},
};

export default productUiData;
