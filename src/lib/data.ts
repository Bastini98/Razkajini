// src/lib/data.ts
export interface Product {
  id: string;
  slug: string;
  titleBg: string;
  category: 'book' | 'audio' | 'puppet' | 'show';
  price: number;
  compareAtPrice?: number;
  rating: number;
  stock: number;
  images: string[];
  badges: string[];
  descriptionHtmlBg: string;
  shortDescriptionBg?: string;
  onSale?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'baba',
    titleBg: 'Бабо, разкажи ни...',
    category: 'book',
    price: 58.7,
    compareAtPrice: 89,
    rating: 4.9,
    stock: 12,
    onSale: true,
    images: [
      // ✅ ново първо
      'https://i.ibb.co/V4HxQzv/babacoverproduct.webp',
      // ⬇️ предишното първо става второ
      'https://razkajini.bg/storage/images/products/gallery/772f13b11852cce6ba377c6c9889b407.png',
      'https://i.ibb.co/JWzcRp93/babacoverpreview.webp',
      'https://i.ibb.co/5g8C5SrF/baba11.webp',
      'https://i.ibb.co/4wbMmY3Y/baba1.png',
    ],
    badges: ['Бестселър', 'Ограничено издание'],
    shortDescriptionBg: 'Книга за записване на спомените на баба',
    descriptionHtmlBg: `
      <p class="text-xl text-gray-700 mb-6">Когато баба разказва, времето спира. Всяка нейна дума носи мъдрост от десетилетия живот, всяка усмивка крие история, която заслужава да бъде запазена завинаги.</p>
      <p class="text-lg text-gray-600 mb-8">Тази книга не е просто подарък – тя е мост между поколенията, съкровищница от спомени и най-ценното наследство, което можете да оставите на децата си.</p>
      <h4 class="text-2xl font-pudelinka font-colus text-ink mb-4">В тази книга ще откриете:</h4>
      <ul>
        <li class="flex items-start space-x-3 mb-3"><span class="text-teal text-xl">✓</span><span>120+ специално подбрани въпроса, които отключват най-дълбоките спомени</span></li>
        <li class="flex items-start space-x-3 mb-3"><span class="text-teal text-xl">✓</span><span>Места за любими снимки и рисунки от миналото</span></li>
        <li class="flex items-start space-x-3 mb-3"><span class="text-teal text-xl">✓</span><span>Красиви илюстрации, които вдъхновяват разказването</span></li>
        <li class="flex items-start space-x-3 mb-3"><span class="text-teal text-xl">✓</span><span>Луксозна хартия и твърди корици за дълготрайност</span></li>
        <li class="flex items-start space-x-3 mb-3"><span class="text-teal text-xl">✓</span><span>Подаръчна опаковка, готова за даване</span></li>
      </ul>
    `,
    whyBuySection: {
      image: 'https://i.ibb.co/JFtXjdNK/4d0d986d-cb51-4c07-9eaa-d9224c18f200.webp',
      title: 'Защо да купиш тази книга?',
      content: `
        <p class="font-colus text-xl text-gray-800 mb-6 leading-relaxed">Всеки ден губим безценни истории. Всеки ден, когато не попитаме баба за детството ѝ, за първата ѝ любов, за трудните времена, които е преживяла – тези спомени изчезват завинаги.</p>
        <p class="text-lg text-gray-700 mb-6">Тази книга не е просто колекция от въпроси. Тя е ключът към сърцето на баба, начинът да я накараш да се усмихне, да заплаче от носталгия и да сподели онова, което никога не е разказвала.</p>
        <div class="bg-sand-light/30 p-6 rounded-2xl mb-6">
          <p class="text-lg font-medium text-ink mb-3">Представи си момента, когато:</p>
          <ul class="space-y-2 text-gray-700">
            <li>• Баба ти разказва за първия си танц</li>
            <li>• Споделя тайни рецепти, които никой не знае</li>
            <li>• Описва как е било да отглежда деца в друго време</li>
            <li>• Дава ти съвети, които ще носиш цял живот</li>
          </ul>
        </div>
        <p class="text-lg text-gray-700">Това са моментите, които правят живота смислен. Това са спомените, които ще предадеш на своите деца.</p>
      `
    },
    galleryImages: [
      // ✅ добавяме новата корица и в превютата, за да бъде първа и там
      'https://i.ibb.co/V4HxQzv/babacoverproduct.webp',
      'https://i.ibb.co/5g8C5SrF/baba11.webp',
      'https://i.ibb.co/4wbMmY3Y/baba1.png',
      'https://i.ibb.co/mV7ZJ0xz/baba2.png',
      'https://i.ibb.co/4RcFVqkQ/baba3.png',
      'https://i.ibb.co/nNKJb8FB/baba4.png',
      'https://i.ibb.co/yc03WChc/baba5.png',
      'https://i.ibb.co/gLn84ZCP/baba6.png',
      'https://i.ibb.co/DH1q325G/baba7.png',
      'https://i.ibb.co/Pv1jrbJf/baba8.png'
    ],
    warmthSectionImages: [
      'https://i.ibb.co/FL24spMY/Chat-GPT-Image-Sep-29-2025-05-04-15-PM.webp',
      'https://i.ibb.co/1fq1qGSD/Generated-Image-September-29-2025-4-33-PM.webp',
      'https://i.ibb.co/RkBV2Tgt/Generated-Image-September-29-2025-4-34-PM.webp',
      'https://i.ibb.co/zVHHXGGJ/Generated-Image-September-29-2025-4-39-PM-1.webp'
    ],
    emotionalBenefits: {
      title: 'Защо тази книга е по-специална от всеки друг подарък?',
      content: `
        <p class="text-xl text-gray-800 mb-6">Дрехите се износват. Бижутата се губят. Цветята увяхват. Но историите... историите живеят завинаги.</p>
        <p class="text-lg text-gray-700 mb-6">Когато подариш тази книга, не даваш просто предмет. Даваш време. Даваш внимание. Даваш възможност на баба да се почувства важна, чута, обичана.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-sand/20">
            <h4 class="font-colus font-bold text-ink mb-3">Обикновен подарък:</h4>
            <ul class="text-gray-600 space-y-2">
              <li>• Се използва веднъж</li>
              <li>• Забравя се с времето</li>
              <li>• Носи временна радост</li>
            </ul>
          </div>
          <div class="bg-teal/5 p-6 rounded-2xl border border-teal/20">
            <h4 class="font-colus font-bold text-teal mb-3">Тази книга:</h4>
            <ul class="text-gray-700 space-y-2">
              <li>• Създава спомени за цял живот</li>
              <li>• Става семейно съкровище</li>
              <li>• Свързва поколенията</li>
            </ul>
          </div>
        </div>
        <p class="text-lg text-gray-700">Това е подаръкът, който ще се помни и ще се предава от поколение на поколение.</p>
      `
    },
    faq: [
      {
        question: 'Подходяща ли е книгата за всички баби?',
        answer: 'Абсолютно! Въпросите са създадени така, че да бъдат универсални и подходящи за всяка баба, независимо от възрастта или жизнения ѝ опит. Всяка история е ценна.'
      },
      {
        question: 'Колко време отнема попълването на книгата?',
        answer: 'Няма ограничение по време! Можете да я попълвате постепенно - по няколко въпроса всяка седмица. Това прави процеса още по-приятен и дава време за дълбоки разговори.'
      },
      {
        question: 'Какво ако баба не иска да разказва?',
        answer: 'Въпросите са формулирани по начин, който естествено предизвиква желание за споделяне. Започнете с по-леките теми - детството, любимите ястия. Постепенно ще видите как се отваря.'
      },
      {
        question: 'Струва ли си инвестицията?',
        answer: 'Помислете колко струва един час с психолог или терапевт. Тази книга ви дава безценни часове качествено време с баба и създава наследство, което ще се предава в семейството завинаги.'
      },
      {
        question: 'Мога ли да върна книгата, ако не съм доволен?',
        answer: 'Разбира се! Предлагаме 14-дневна гаранция за връщане без въпроси. Но сме сигурни, че ще останете възхитени от резултата.'
      }
    ]
  },
  {
    id: '2',
    slug: 'dyado',
    titleBg: 'Дядо, разкажи ни...',
    category: 'book',
    price: 39,
    compareAtPrice: 45,
    rating: 4.8,
    stock: 18,
    onSale: true,
    images: [
      // ✅ ново първо
      'https://i.ibb.co/npB4WP6/dqdocoverproduct.webp',
      // ⬇️ предишното първо става второ
      'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    badges: ['Бестселър'],
    shortDescriptionBg: 'Книга за записване на спомените на дядо',
    descriptionHtmlBg: `
      <h3>Историите на дядо, записани завинаги</h3>
      <p>Специално създадена за дядовците книга с въпроси за войничество, първата работа, семейството и мъжките приключения.</p>
      <h4>Специални теми за дядовци:</h4>
      <ul>
        <li>Детство и младежки години</li>
        <li>Войничество и работа</li>
        <li>Семейство и отговорности</li>
        <li>Мъдрости и съвети</li>
      </ul>
    `,
  },
  {
    id: '3',
    slug: 'audio-prikazki-za-son',
    titleBg: 'Аудио приказки за сън',
    category: 'audio',
    price: 25,
    rating: 4.7,
    stock: 50,
    images: [
      'https://images.pexels.com/photos/7169237/pexels-photo-7169237.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    badges: ['Ново'],
    shortDescriptionBg: 'Колекция от успокояващи приказки',
    descriptionHtmlBg: `
      <h3>Приказки, които слушаме заедно преди сън</h3>
      <p>Колекция от 12 оригинални приказки, разказани с топли гласове и фонова музика.</p>
    `,
  },
  {
    id: '4',
    slug: 'teatralna-kukla-princesa',
    titleBg: 'Театрална кукла Принцеса',
    category: 'puppet',
    price: 65,
    rating: 4.6,
    stock: 8,
    images: [
      'https://images.pexels.com/photos/6195122/pexels-photo-6195122.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    badges: ['Ръчна изработка'],
    shortDescriptionBg: 'Красива театрална кукла за домашни спектакли',
    descriptionHtmlBg: `
      <h3>Играй историята у дома</h3>
      <p>Красиво изработена театрална кукла, перфектна за домашни представления и творческа игра.</p>
    `,
  },
];

export const testimonials = [
  {
    id: '1',
    text: 'Баба плака, когато видя въпросите за детството и. Най-хубавият ни празник.',
    author: 'Мария К.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '2', 
    text: 'Записахме спомени за първата му работа и за войниклъка.',
    author: 'Иво П.',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '3',
    text: 'Събрахме се три поколения около масата — незабравимо.',
    author: 'Елина Д.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '4',
    text: 'Баба ми разказа истории, които никога не бях чувала. Плакахме и се смяхме заедно.',
    author: 'Анна С.',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '5',
    text: 'Най-добрата инвестиция в семейството ни. Децата обожават да слушат историите.',
    author: 'Петър М.',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '6',
    text: 'Открихме семейни тайни и традиции, които щяха да се загубят завинаги.',
    author: 'Светлана Т.',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '7',
    text: 'Баба се почувства толкова важна и обичана. Благодаря ви за тази идея!',
    author: 'Димитър В.',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '8',
    text: 'Записахме рецепти и традиции, които сега предавам на дъщеря си.',
    author: 'Мила Н.',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '9',
    text: 'Всяка страница е пълна с любов и мъдрост. Истинско съкровище.',
    author: 'Георги Л.',
    avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '10',
    text: 'Най-емоционалният подарък, който съм давала някога. Баба беше развълнувана.',
    author: 'Радка П.',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '11',
    text: 'Сега имаме книга, която ще четем на внуците си. Безценно!',
    author: 'Стоян К.',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '12',
    text: 'Превърна се в семейна традиция. Всяка неделя попълваме по няколко страници.',
    author: 'Ваня Д.',
    avatar: 'https://images.pexels.com/photos/1181525/pexels-photo-1181525.jpeg?auto=compress&cs=tinysrgb&w=150',
  }
];

export const bookstores = [
  { name: 'Orange Center', location: 'София' },
  { name: 'Ciela', location: 'Национално покритие' },
  { name: 'Helikon', location: 'София, Пловдив' },
  { name: 'Книгомания', location: 'Варна, Бургас' },
  { name: 'Penguins', location: 'София' },
  { name: 'Аполония', location: 'Пловдив' },
  { name: 'Книжарница Хермес', location: 'Стара Загора' },
  { name: 'Сиела Норма', location: 'Русе' }
];

export const bundleProduct = {
  id: 'bundle-baba-dyado',
  title: 'Комплект: Баба + Дядо',
  subtitle: 'Пълната колекция за цялото семейство',
  price: 69,
  compareAtPrice: 78,
  image: 'https://i.ibb.co/kLbR1bz/Screenshot-14-copy.png',
  description: 'Двете книги заедно с 10% отстъпка. Идеалният подарък за запазване на историите на цялото семейство.',
  savings: 9
};

export const blogPosts = [
  {
    id: '1',
    slug: 'kak-da-zapazim-semeynite-istorii',
    titleBg: 'Как да запазим семейните истории',
    excerpt: 'Съвети за записване и предаване на спомените между поколенията.',
    readingTime: '5 мин четене',
    publishedAt: '2024-12-15',
    image: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: 'Семейните истории са съкровище...',
  },
  {
    id: '2',
    slug: 'vazrastta-ne-e-prechka-za-spodelyaneto',
    titleBg: 'Възрастта не е пречка за споделянето',
    excerpt: 'Защо никога не е късно да започнем да записваме спомените си.',
    readingTime: '3 мин четене',
    publishedAt: '2024-12-10',
    image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: 'Много хора смятат, че е твърде късно...',
  },
];
