// 頁面 router
export const PageLinks = {
  productLink: { title: '綠果精選系列', url: '/product' },
  customLink: { title: '客製化點餐', url: '/custom' },
  aboutLink: { title: '關於綠果', url: '/about' },
  articleLink: { title: '綠果專欄', url: '/article' },
};

// Hero Section
export const HeroDecors = [
  {
    id: 'left',
    src: `${import.meta.env.BASE_URL}img/items/bowl-2.png`,
    alt: 'bowl-2',
    posX: 'start-0',
    posY: 'top-10',
  },
  {
    id: 'right',
    src: `${import.meta.env.BASE_URL}img/items/bowl-1.png`,
    alt: 'bowl-1',
    posX: 'start-100',
    posY: 'top-50',
  },
];

// Hero Section 果菜區
export const VeggieItems = [
  { name: 'tomato', angle: '-120deg', delay: '-2s', dur: '20s' },
  { name: 'broccoli', angle: '45deg', delay: '-15s', dur: '25s' },
  { name: 'cabbage', angle: '150deg', delay: '-5s', dur: '22s' },
  { name: 'carrot', angle: '90deg', delay: '-8s', dur: '20s' },
  { name: 'eggplant', angle: '-45deg', delay: '-10s', dur: '20s' },
  { name: 'scallion', angle: '-90deg', delay: '-10s', dur: '20s' },
  { name: 'spinach', angle: '-120deg', delay: '-4s', dur: '30s' },
  { name: 'bellPepper', angle: '30deg', delay: '-8s', dur: '25s' },
];

// Signature Section 配菜區
export const Ingredients = [
  {
    id: 'salmon',
    name: '鮭魚',
    nur: '蛋白質',
    gram: '26 g',
    percentage: 0.85,
    color: '#ffa43b',
    pos: 'pos-btm-left',
    img: `${import.meta.env.BASE_URL}img/items/salmon.png`,
  },
  // 熱量：約 250 kcal/蛋白質：約 26 g/脂肪：約 16 g
  {
    id: 'tomato',
    name: '番茄',
    nur: '維生素C',
    gram: '0.8 g',
    percentage: 0.25,
    color: '#C54F2D',
    pos: 'pos-top-mid',
    img: `${import.meta.env.BASE_URL}img/items/tomato.png`,
  },
  // 熱量：約 11 kcal/碳水化合物：約 2.5 g/膳食纖維：約 0.8 g/維生素C：約 0.8 g
  {
    id: 'pumpkin',
    name: '南瓜',
    nur: '熱量',
    gram: '45 kcal',
    percentage: 0.06,
    color: '#f7da4b',
    pos: 'pos-top-mid-left',
    img: `${import.meta.env.BASE_URL}img/items/pumpkin.png`,
  },
  // 熱量：約 45 kcal/碳水化合物：約 11 g/膳食纖維：約 2 g
  {
    id: 'broccoli',
    name: '花椰菜',
    nur: '膳食纖維',
    gram: '2.2 g',
    percentage: 0.06,
    color: '#81C784',
    pos: 'pos-top-right',
    img: `${import.meta.env.BASE_URL}img/items/broccoli.png`,
  },
  // 熱量：約 28 kcal/碳水化合物：約 5 g/蛋白質：約 2.5 g/膳食纖維：約 2.2 g
  {
    id: 'cucumber',
    name: '小黃瓜',
    nur: '碳水',
    gram: '2 g',
    percentage: 0.02,
    color: '#6FA9BB',
    pos: 'pos-btm-right',
    img: `${import.meta.env.BASE_URL}img/items/cucumber.png`,
  },
  // 熱量：約 9 kcal/碳水化合物：約 2 g
];

// step card
// 步驟區
export const StepCards = [
  {
    id: 1,
    step_title: '選擇基底',
    step_content: '白米、糙米、紫米、藜麥、生菜',
    img: `${import.meta.env.BASE_URL}img/items/step1.png`,
    icon: 'bi bi-1-circle-fill',
  },
  {
    id: 2,
    step_title: '挑選主食',
    step_content: '雞胸肉、牛肉、鮭魚、蝦仁，為你包山包海',
    img: `${import.meta.env.BASE_URL}img/items/step2.png`,
    icon: 'bi bi-2-circle-fill',
  },
  {
    id: 3,
    step_title: '搭配蔬果',
    step_content: '配角可以比主角搶戲，季節時蔬任選 5 種',
    img: `${import.meta.env.BASE_URL}img/items/step3.png`,
    icon: 'bi bi-3-circle-fill',
  },
  {
    id: 4,
    step_title: '淋上醬汁',
    step_content: '為你的餐盒來點靈魂',
    img: `${import.meta.env.BASE_URL}img/items/step4.png`,
    icon: 'bi bi-4-circle-fill',
  },
];

// 餐點卡片區
// 模擬資料，因為無法確認實際熱門產品(功能未上架)
export const FixedMeals = [
  {
    id: '-Ol1k7ZvEvYKdnM5LjO5',
    name: '經典雙雞蛋白碗',
    price: 230,
    nutrition: {
      calories: 550,
      carbs: 16,
      fat: 30,
      protein: 60,
    },
    img: `${import.meta.env.BASE_URL}img/items/bowl-3.png`,
    tags: ['多多蛋白', '人氣推薦'],
    rank: 'TOP1',
  },
  {
    id: '-Ol1jC5VMymiwkD5f9-6',
    name: '三重蛋白活力碗',
    price: 240,
    nutrition: {
      calories: 416,
      carbs: 31,
      fat: 9,
      protein: 60,
    },
    img: `${import.meta.env.BASE_URL}img/items/bowl-4.png`,
    tags: ['多多蛋白'],
    rank: 'TOP2',
  },
  {
    id: '-Ol1ZiESsF3T3jX7eUlu',
    name: '海味清爽檸香碗',
    price: 220,
    nutrition: {
      calories: 332,
      carbs: 25,
      fat: 6,
      protein: 45,
    },
    img: `${import.meta.env.BASE_URL}img/items/bowl-5.png`,
    tags: ['低脂低卡'],
    rank: 'TOP3',
  },
  {
    id: '-Ol1Yg6sYms42TFNwrEc',
    name: '豆香高纖和風碗',
    price: 150,
    nutrition: {
      calories: 314,
      carbs: 25,
      fat: 16,
      protein: 21,
    },
    img: `${import.meta.env.BASE_URL}img/items/bowl-2.png`,
    tags: ['低脂低卡', '新鮮蔬食'],
    rank: 'TOP4',
  },
  {
    id: '-Ol1lnSihO7S16xBIymi',
    name: '海陸三拼能量碗',
    price: 280,
    nutrition: {
      calories: 595,
      carbs: 24,
      fat: 24,
      protein: 73,
    },
    img: `${import.meta.env.BASE_URL}img/items/bowl-1.png`,
    tags: ['多多蛋白'],
    rank: 'TOP5',
  },
];

// comment card
export const CommentContent = [
  {
    commentContent: '真的很好吃！特別喜歡藜麥飯的口感，完全不乾，很Q彈～',
    customer: '@ashley_dailyhealthy',
    star: 3,
  },
  {
    commentContent:
      '以前備餐都要花兩小時，現在只要動動手指就能吃到很精準的蛋白質與營養。那個熱量計算機真的太神啦！',
    customer: '@ryanworkout',
    star: 4,
  },
  {
    commentContent:
      '訓練後最怕餓死，還好有這個餐盒，份量足夠，蛋白質量夠高，重點是吃起來完全沒負擔！我的增肌期夥伴！',
    customer: '@muscle_gains_pro',
    star: 5,
  },
  {
    commentContent:
      '連我家挑食的小朋友都說好吃！食材超新鮮，口味清爽不油膩，現在全家人的健康餐點都交給它了！',
    customer: '@healthy_fam_meals',
    star: 5,
  },
  {
    commentContent:
      '每​個​禮拜​最​期待​的​就​是​新​的​菜單！​以為​健康​餐會​吃膩？​結果​不​斷​更新​的​口味，​讓​我​每​次​都​有​選擇​障礙，​是​幸福​的​煩惱​啦！​😍​',
    customer: '@menu_explorer_88',
    star: 5,
  },
  {
    commentContent: '這​是​我​唯​一​吃​了​兩個月​都​還​沒膩​的​健康​餐💯',
    customer: '@gourmet_on_diet',
    star: 5,
  },
  {
    commentContent:
      '午​餐​救星！​省​去​外出​覓食​的​時間，​而且​每​一​餐​都​均衡​又​美味，​讓​我​下午​工作​精神​滿滿，​不​再​昏昏欲​睡！​',
    customer: '@fuel_my_hustle',
    star: 4,
  },
  {
    commentContent: '大​推舒​肥雞，​完全​不柴，​愛​了​愛​了​😋​',
    customer: '@eddie_fitwhealthy',
    star: 4,
  },
  // {
  //   commentContent: '',
  //   customer: '',
  //   star: ,
  // }
  // {
  //   commentContent: '',
  //   customer: '',
  //   star: ,
  // }
  // {
  //   commentContent: '',
  //   customer: '',
  //   star: ,
  // }
];
