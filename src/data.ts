import type { Prefecture, Region } from './types';

const createDistricts = (prefectureId: string, districtNames: { name: string; nameJp: string }[]) => {
  return districtNames.map((d, index) => ({
    id: `${prefectureId}-district-${index}`,
    name: d.name,
    nameJp: d.nameJp,
    visited: false,
    locations: []
  }));
};

export const initialPrefectures: Prefecture[] = [
  // Hokkaido Region
  {
    id: 'hokkaido',
    name: 'Hokkaido',
    nameJp: '北海道',
    region: 'hokkaido',
    districts: createDistricts('hokkaido', [
      { name: 'Sapporo', nameJp: '札幌' },
      { name: 'Hakodate', nameJp: '函館' },
      { name: 'Asahikawa', nameJp: '旭川' },
      { name: 'Kushiro', nameJp: '釧路' },
      { name: 'Obihiro', nameJp: '帯広' },
      { name: 'Kitami', nameJp: '北見' },
      { name: 'Otaru', nameJp: '小樽' },
      { name: 'Muroran', nameJp: '室蘭' },
      { name: 'Tomakomai', nameJp: '苫小牧' },
      { name: 'Ebetsu', nameJp: '江別' },
      { name: 'Chitose', nameJp: '千歳' },
      { name: 'Eniwa', nameJp: '恵庭' },
      { name: 'Iwamizawa', nameJp: '岩見沢' },
      { name: 'Kitahiroshima', nameJp: '北広島' }
    ]),
    svgPath: 'M380,20 L400,25 L410,35 L405,50 L395,55 L385,45 L375,30 Z'
  },

  // Tohoku Region
  {
    id: 'aomori',
    name: 'Aomori',
    nameJp: '青森県',
    region: 'tohoku',
    districts: createDistricts('aomori', [
      { name: 'Aomori', nameJp: '青森' },
      { name: 'Hirosaki', nameJp: '弘前' },
      { name: 'Hachinohe', nameJp: '八戸' },
      { name: 'Towada', nameJp: '十和田' },
      { name: 'Mutsu', nameJp: 'むつ' },
      { name: 'Goshogawara', nameJp: '五所川原' },
      { name: 'Kuroishi', nameJp: '黒石' },
      { name: 'Tsugaru', nameJp: 'つがる' },
      { name: 'Hirakawa', nameJp: '平川' }
    ]),
    svgPath: 'M360,80 L380,80 L380,100 L375,115 L365,115 L355,100 Z'
  },
  {
    id: 'iwate',
    name: 'Iwate',
    nameJp: '岩手県',
    region: 'tohoku',
    districts: createDistricts('iwate', [
      { name: 'Morioka', nameJp: '盛岡' },
      { name: 'Ichinoseki', nameJp: '一関' },
      { name: 'Oshu', nameJp: '奥州' },
      { name: 'Hanamaki', nameJp: '花巻' },
      { name: 'Kitakami', nameJp: '北上' },
      { name: 'Kamaishi', nameJp: '釜石' },
      { name: 'Miyako', nameJp: '宮古' },
      { name: 'Hachimantai', nameJp: '八幡平' },
      { name: 'Takizawa', nameJp: '滝沢' },
      { name: 'Ninohe', nameJp: '二戸' }
    ]),
    svgPath: 'M365,115 L375,115 L375,145 L370,160 L360,155 L360,130 Z'
  },
  {
    id: 'miyagi',
    name: 'Miyagi',
    nameJp: '宮城県',
    region: 'tohoku',
    districts: createDistricts('miyagi', [
      { name: 'Sendai', nameJp: '仙台' },
      { name: 'Ishinomaki', nameJp: '石巻' },
      { name: 'Kesennuma', nameJp: '気仙沼' },
      { name: 'Shiogama', nameJp: '塩竈' },
      { name: 'Natori', nameJp: '名取' },
      { name: 'Kakuda', nameJp: '角田' },
      { name: 'Tagajo', nameJp: '多賀城' },
      { name: 'Tome', nameJp: '登米' },
      { name: 'Kurihara', nameJp: '栗原' },
      { name: 'Osaki', nameJp: '大崎' }
    ]),
    svgPath: 'M355,145 L370,145 L370,165 L360,170 L350,160 Z'
  },
  {
    id: 'akita',
    name: 'Akita',
    nameJp: '秋田県',
    region: 'tohoku',
    districts: createDistricts('akita', [
      { name: 'Akita', nameJp: '秋田' },
      { name: 'Odate', nameJp: '大館' },
      { name: 'Yokote', nameJp: '横手' },
      { name: 'Kazuno', nameJp: '鹿角' },
      { name: 'Yuzawa', nameJp: '湯沢' },
      { name: 'Daisen', nameJp: '大仙' },
      { name: 'Noshiro', nameJp: '能代' },
      { name: 'Kitaakita', nameJp: '北秋田' },
      { name: 'Semboku', nameJp: '仙北' }
    ]),
    svgPath: 'M330,115 L360,115 L360,145 L330,145 Z'
  },
  {
    id: 'yamagata',
    name: 'Yamagata',
    nameJp: '山形県',
    region: 'tohoku',
    districts: createDistricts('yamagata', [
      { name: 'Yamagata', nameJp: '山形' },
      { name: 'Tsuruoka', nameJp: '鶴岡' },
      { name: 'Sakata', nameJp: '酒田' },
      { name: 'Yonezawa', nameJp: '米沢' },
      { name: 'Shinjo', nameJp: '新庄' },
      { name: 'Obanazawa', nameJp: '尾花沢' },
      { name: 'Sagae', nameJp: '寒河江' },
      { name: 'Tendo', nameJp: '天童' },
      { name: 'Nagai', nameJp: '長井' },
      { name: 'Kaminoyama', nameJp: '上山' }
    ]),
    svgPath: 'M330,145 L355,145 L350,170 L335,170 Z'
  },
  {
    id: 'fukushima',
    name: 'Fukushima',
    nameJp: '福島県',
    region: 'tohoku',
    districts: createDistricts('fukushima', [
      { name: 'Fukushima', nameJp: '福島' },
      { name: 'Koriyama', nameJp: '郡山' },
      { name: 'Iwaki', nameJp: 'いわき' },
      { name: 'Aizuwakamatsu', nameJp: '会津若松' },
      { name: 'Shirakawa', nameJp: '白河' },
      { name: 'Soma', nameJp: '相馬' },
      { name: 'Sukagawa', nameJp: '須賀川' },
      { name: 'Date', nameJp: '伊達' },
      { name: 'Motomiya', nameJp: '本宮' },
      { name: 'Tamura', nameJp: '田村' }
    ]),
    svgPath: 'M335,170 L360,170 L355,195 L335,190 Z'
  },

  // Kanto Region
  {
    id: 'ibaraki',
    name: 'Ibaraki',
    nameJp: '茨城県',
    region: 'kanto',
    districts: createDistricts('ibaraki', [
      { name: 'Mito', nameJp: '水戸' },
      { name: 'Tsukuba', nameJp: 'つくば' },
      { name: 'Hitachi', nameJp: '日立' },
      { name: 'Kashima', nameJp: '鹿嶋' },
      { name: 'Tsuchiura', nameJp: '土浦' },
      { name: 'Koga', nameJp: '古河' },
      { name: 'Tsukubamirai', nameJp: 'つくばみらい' },
      { name: 'Chikusei', nameJp: '筑西' },
      { name: 'Shimotsuma', nameJp: '下妻' },
      { name: 'Ushiku', nameJp: '牛久' }
    ]),
    svgPath: 'M355,195 L375,195 L370,220 L355,215 Z'
  },
  {
    id: 'tochigi',
    name: 'Tochigi',
    nameJp: '栃木県',
    region: 'kanto',
    districts: createDistricts('tochigi', [
      { name: 'Utsunomiya', nameJp: '宇都宮' },
      { name: 'Ashikaga', nameJp: '足利' },
      { name: 'Nikko', nameJp: '日光' },
      { name: 'Kanuma', nameJp: '鹿沼' },
      { name: 'Otawara', nameJp: '大田原' },
      { name: 'Oyama', nameJp: '小山' },
      { name: 'Tochigi', nameJp: '栃木' },
      { name: 'Yaita', nameJp: '矢板' },
      { name: 'Nasushiobara', nameJp: '那須塩原' },
      { name: 'Moka', nameJp: '真岡' }
    ]),
    svgPath: 'M330,180 L355,180 L355,200 L330,195 Z'
  },
  {
    id: 'gunma',
    name: 'Gunma',
    nameJp: '群馬県',
    region: 'kanto',
    districts: createDistricts('gunma', [
      { name: 'Maebashi', nameJp: '前橋' },
      { name: 'Takasaki', nameJp: '高崎' },
      { name: 'Kiryu', nameJp: '桐生' },
      { name: 'Numata', nameJp: '沼田' },
      { name: 'Tomioka', nameJp: '富岡' },
      { name: 'Isesaki', nameJp: '伊勢崎' },
      { name: 'Ota', nameJp: '太田' },
      { name: 'Annaka', nameJp: '安中' },
      { name: 'Shibukawa', nameJp: '渋川' },
      { name: 'Fujioka', nameJp: '藤岡' }
    ]),
    svgPath: 'M310,175 L330,180 L330,200 L310,195 Z'
  },
  {
    id: 'saitama',
    name: 'Saitama',
    nameJp: '埼玉県',
    region: 'kanto',
    districts: createDistricts('saitama', [
      { name: 'Saitama', nameJp: 'さいたま' },
      { name: 'Kawagoe', nameJp: '川越' },
      { name: 'Kumagaya', nameJp: '熊谷' },
      { name: 'Tokorozawa', nameJp: '所沢' },
      { name: 'Chichibu', nameJp: '秩父' },
      { name: 'Kasukabe', nameJp: '春日部' },
      { name: 'Kawaguchi', nameJp: '川口' },
      { name: 'Koshigaya', nameJp: '越谷' },
      { name: 'Soka', nameJp: '草加' },
      { name: 'Kuki', nameJp: '久喜' }
    ]),
    svgPath: 'M315,195 L335,190 L335,210 L320,210 Z'
  },
  {
    id: 'chiba',
    name: 'Chiba',
    nameJp: '千葉県',
    region: 'kanto',
    districts: createDistricts('chiba', [
      { name: 'Chiba', nameJp: '千葉' },
      { name: 'Funabashi', nameJp: '船橋' },
      { name: 'Kisarazu', nameJp: '木更津' },
      { name: 'Narita', nameJp: '成田' },
      { name: 'Kashiwa', nameJp: '柏' },
      { name: 'Matsudo', nameJp: '松戸' },
      { name: 'Noda', nameJp: '野田' },
      { name: 'Ichikawa', nameJp: '市川' },
      { name: 'Urayasu', nameJp: '浦安' },
      { name: 'Narashino', nameJp: '習志野' }
    ]),
    svgPath: 'M355,215 L370,220 L365,245 L355,240 Z'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    nameJp: '東京都',
    region: 'kanto',
    districts: createDistricts('tokyo', [
      { name: 'Chiyoda', nameJp: '千代田区' },
      { name: 'Chuo', nameJp: '中央区' },
      { name: 'Minato', nameJp: '港区' },
      { name: 'Shinjuku', nameJp: '新宿区' },
      { name: 'Bunkyo', nameJp: '文京区' },
      { name: 'Taito', nameJp: '台東区' },
      { name: 'Sumida', nameJp: '墨田区' },
      { name: 'Koto', nameJp: '江東区' },
      { name: 'Shinagawa', nameJp: '品川区' },
      { name: 'Meguro', nameJp: '目黒区' },
      { name: 'Ota', nameJp: '大田区' },
      { name: 'Setagaya', nameJp: '世田谷区' },
      { name: 'Shibuya', nameJp: '渋谷区' },
      { name: 'Nakano', nameJp: '中野区' },
      { name: 'Suginami', nameJp: '杉並区' },
      { name: 'Toshima', nameJp: '豊島区' },
      { name: 'Kita', nameJp: '北区' },
      { name: 'Arakawa', nameJp: '荒川区' },
      { name: 'Itabashi', nameJp: '板橋区' },
      { name: 'Nerima', nameJp: '練馬区' },
      { name: 'Adachi', nameJp: '足立区' },
      { name: 'Katsushika', nameJp: '葛飾区' },
      { name: 'Edogawa', nameJp: '江戸川区' }
    ]),
    svgPath: 'M320,210 L335,210 L340,225 L325,225 Z'
  },
  {
    id: 'kanagawa',
    name: 'Kanagawa',
    nameJp: '神奈川県',
    region: 'kanto',
    districts: createDistricts('kanagawa', [
      { name: 'Yokohama', nameJp: '横浜' },
      { name: 'Kawasaki', nameJp: '川崎' },
      { name: 'Sagamihara', nameJp: '相模原' },
      { name: 'Kamakura', nameJp: '鎌倉' },
      { name: 'Odawara', nameJp: '小田原' },
      { name: 'Yokosuka', nameJp: '横須賀' },
      { name: 'Fujisawa', nameJp: '藤沢' },
      { name: 'Hiratsuka', nameJp: '平塚' },
      { name: 'Atsugi', nameJp: '厚木' },
      { name: 'Chigasaki', nameJp: '茅ヶ崎' }
    ]),
    svgPath: 'M310,210 L320,210 L318,225 L305,220 Z'
  },

  // Chubu Region
  {
    id: 'niigata',
    name: 'Niigata',
    nameJp: '新潟県',
    region: 'chubu',
    districts: createDistricts('niigata', [
      { name: 'Niigata', nameJp: '新潟' },
      { name: 'Nagaoka', nameJp: '長岡' },
      { name: 'Joetsu', nameJp: '上越' },
      { name: 'Shibata', nameJp: '新発田' },
      { name: 'Murakami', nameJp: '村上' },
      { name: 'Kashiwazaki', nameJp: '柏崎' },
      { name: 'Sanjo', nameJp: '三条' },
      { name: 'Tsubame', nameJp: '燕' },
      { name: 'Minamiuonuma', nameJp: '南魚沼' },
      { name: 'Tokamachi', nameJp: '十日町' }
    ]),
    svgPath: 'M280,145 L330,145 L325,175 L285,170 Z'
  },
  {
    id: 'toyama',
    name: 'Toyama',
    nameJp: '富山県',
    region: 'chubu',
    districts: createDistricts('toyama', [
      { name: 'Toyama', nameJp: '富山' },
      { name: 'Takaoka', nameJp: '高岡' },
      { name: 'Uozu', nameJp: '魚津' },
      { name: 'Kurobe', nameJp: '黒部' },
      { name: 'Himi', nameJp: '氷見' },
      { name: 'Namerikawa', nameJp: '滑川' },
      { name: 'Tonami', nameJp: '砺波' },
      { name: 'Nanto', nameJp: '南砺' },
      { name: 'Kamiichi', nameJp: '上市' },
      { name: 'Tateyama', nameJp: '立山' }
    ]),
    svgPath: 'M250,155 L280,155 L280,175 L250,170 Z'
  },
  {
    id: 'ishikawa',
    name: 'Ishikawa',
    nameJp: '石川県',
    region: 'chubu',
    districts: createDistricts('ishikawa', [
      { name: 'Kanazawa', nameJp: '金沢' },
      { name: 'Wajima', nameJp: '輪島' },
      { name: 'Nanao', nameJp: '七尾' },
      { name: 'Komatsu', nameJp: '小松' },
      { name: 'Kaga', nameJp: '加賀' },
      { name: 'Noto', nameJp: '能登' },
      { name: 'Hakusan', nameJp: '白山' },
      { name: 'Kahoku', nameJp: 'かほく' },
      { name: 'Nomi', nameJp: '能美' },
      { name: 'Hakui', nameJp: '羽咋' }
    ]),
    svgPath: 'M220,140 L250,145 L250,170 L225,165 L215,150 Z'
  },
  {
    id: 'fukui',
    name: 'Fukui',
    nameJp: '福井県',
    region: 'chubu',
    districts: createDistricts('fukui', [
      { name: 'Fukui', nameJp: '福井' },
      { name: 'Tsuruga', nameJp: '敦賀' },
      { name: 'Obama', nameJp: '小浜' },
      { name: 'Ono', nameJp: '大野' },
      { name: 'Katsuyama', nameJp: '勝山' },
      { name: 'Sabae', nameJp: '鯖江' },
      { name: 'Echizen', nameJp: '越前' },
      { name: 'Awara', nameJp: 'あわら' },
      { name: 'Sakai', nameJp: '坂井' },
      { name: 'Yoshida', nameJp: '吉田' }
    ]),
    svgPath: 'M225,165 L250,170 L245,185 L220,180 Z'
  },
  {
    id: 'yamanashi',
    name: 'Yamanashi',
    nameJp: '山梨県',
    region: 'chubu',
    districts: createDistricts('yamanashi', [
      { name: 'Kofu', nameJp: '甲府' },
      { name: 'Fujiyoshida', nameJp: '富士吉田' },
      { name: 'Kawaguchiko', nameJp: '河口湖' },
      { name: 'Tsuru', nameJp: '都留' },
      { name: 'Minami-Alps', nameJp: '南アルプス' },
      { name: 'Fuefuki', nameJp: '笛吹' },
      { name: 'Yamanashi', nameJp: '山梨' },
      { name: 'Otsuki', nameJp: '大月' },
      { name: 'Nirasaki', nameJp: '韮崎' },
      { name: 'Chuo', nameJp: '中央市' }
    ]),
    svgPath: 'M300,195 L315,195 L310,215 L295,210 Z'
  },
  {
    id: 'nagano',
    name: 'Nagano',
    nameJp: '長野県',
    region: 'chubu',
    districts: createDistricts('nagano', [
      { name: 'Nagano', nameJp: '長野' },
      { name: 'Matsumoto', nameJp: '松本' },
      { name: 'Karuizawa', nameJp: '軽井沢' },
      { name: 'Suwa', nameJp: '諏訪' },
      { name: 'Ueda', nameJp: '上田' },
      { name: 'Shiojiri', nameJp: '塩尻' },
      { name: 'Iiyama', nameJp: '飯山' },
      { name: 'Komoro', nameJp: '小諸' },
      { name: 'Okaya', nameJp: '岡谷' },
      { name: 'Ina', nameJp: '伊那' }
    ]),
    svgPath: 'M270,170 L310,175 L310,205 L275,200 L265,185 Z'
  },
  {
    id: 'gifu',
    name: 'Gifu',
    nameJp: '岐阜県',
    region: 'chubu',
    districts: createDistricts('gifu', [
      { name: 'Gifu', nameJp: '岐阜' },
      { name: 'Takayama', nameJp: '高山' },
      { name: 'Gero', nameJp: '下呂' },
      { name: 'Ogaki', nameJp: '大垣' },
      { name: 'Gujo', nameJp: '郡上' },
      { name: 'Hida', nameJp: '飛騨' },
      { name: 'Kani', nameJp: '可児' },
      { name: 'Hashima', nameJp: '羽島' },
      { name: 'Kaizu', nameJp: '海津' },
      { name: 'Seki', nameJp: '関' }
    ]),
    svgPath: 'M245,185 L275,190 L270,215 L240,210 Z'
  },
  {
    id: 'shizuoka',
    name: 'Shizuoka',
    nameJp: '静岡県',
    region: 'chubu',
    districts: createDistricts('shizuoka', [
      { name: 'Shizuoka', nameJp: '静岡' },
      { name: 'Hamamatsu', nameJp: '浜松' },
      { name: 'Fuji', nameJp: '富士' },
      { name: 'Numazu', nameJp: '沼津' },
      { name: 'Ito', nameJp: '伊東' },
      { name: 'Shimada', nameJp: '島田' },
      { name: 'Mishima', nameJp: '三島' },
      { name: 'Iwata', nameJp: '磐田' },
      { name: 'Yaizu', nameJp: '焼津' },
      { name: 'Fujieda', nameJp: '藤枝' }
    ]),
    svgPath: 'M290,220 L315,220 L310,245 L285,240 Z'
  },
  {
    id: 'aichi',
    name: 'Aichi',
    nameJp: '愛知県',
    region: 'chubu',
    districts: createDistricts('aichi', [
      { name: 'Nagoya', nameJp: '名古屋' },
      { name: 'Toyota', nameJp: '豊田' },
      { name: 'Okazaki', nameJp: '岡崎' },
      { name: 'Ichinomiya', nameJp: '一宮' },
      { name: 'Gamagori', nameJp: '蒲郡' },
      { name: 'Inuyama', nameJp: '犬山' },
      { name: 'Kasugai', nameJp: '春日井' },
      { name: 'Toyohashi', nameJp: '豊橋' },
      { name: 'Anjo', nameJp: '安城' },
      { name: 'Komaki', nameJp: '小牧' }
    ]),
    svgPath: 'M260,215 L290,215 L285,240 L260,235 Z'
  },

  // Kinki Region
  {
    id: 'mie',
    name: 'Mie',
    nameJp: '三重県',
    region: 'kinki',
    districts: createDistricts('mie', [
      { name: 'Tsu', nameJp: '津' },
      { name: 'Yokkaichi', nameJp: '四日市' },
      { name: 'Ise', nameJp: '伊勢' },
      { name: 'Shima', nameJp: '志摩' },
      { name: 'Matsusaka', nameJp: '松阪' },
      { name: 'Kuwana', nameJp: '桑名' },
      { name: 'Suzuka', nameJp: '鈴鹿' },
      { name: 'Nabari', nameJp: '名張' },
      { name: 'Iga', nameJp: '伊賀' },
      { name: 'Kumano', nameJp: '熊野' }
    ]),
    svgPath: 'M285,245 L305,245 L300,270 L280,265 Z'
  },
  {
    id: 'shiga',
    name: 'Shiga',
    nameJp: '滋賀県',
    region: 'kinki',
    districts: createDistricts('shiga', [
      { name: 'Otsu', nameJp: '大津' },
      { name: 'Hikone', nameJp: '彦根' },
      { name: 'Kusatsu', nameJp: '草津' },
      { name: 'Nagahama', nameJp: '長浜' },
      { name: 'Koka', nameJp: '甲賀' },
      { name: 'Omihachiman', nameJp: '近江八幡' },
      { name: 'Yasu', nameJp: '野洲' },
      { name: 'Moriyama', nameJp: '守山' },
      { name: 'Ritto', nameJp: '栗東' },
      { name: 'Konan', nameJp: '湖南' }
    ]),
    svgPath: 'M260,195 L285,195 L280,215 L255,210 Z'
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    nameJp: '京都府',
    region: 'kinki',
    districts: createDistricts('kyoto', [
      { name: 'Kita', nameJp: '北区' },
      { name: 'Kamigyo', nameJp: '上京区' },
      { name: 'Sakyo', nameJp: '左京区' },
      { name: 'Nakagyo', nameJp: '中京区' },
      { name: 'Higashiyama', nameJp: '東山区' },
      { name: 'Shimogyo', nameJp: '下京区' },
      { name: 'Minami', nameJp: '南区' },
      { name: 'Ukyo', nameJp: '右京区' },
      { name: 'Fushimi', nameJp: '伏見区' },
      { name: 'Yamashina', nameJp: '山科区' },
      { name: 'Nishikyo', nameJp: '西京区' },
      { name: 'Muko', nameJp: '向日市' },
      { name: 'Uji', nameJp: '宇治市' },
      { name: 'Kameoka', nameJp: '亀岡市' },
      { name: 'Kyotanabe', nameJp: '京田辺市' },
      { name: 'Otokuni', nameJp: '乙訓郡' },
      { name: 'Kuse', nameJp: '久世郡' }
    ]),
    svgPath: 'M225,185 L260,190 L255,215 L220,210 Z'
  },
  {
    id: 'osaka',
    name: 'Osaka',
    nameJp: '大阪府',
    region: 'kinki',
    districts: createDistricts('osaka', [
      { name: 'Kita', nameJp: '北区' },
      { name: 'Miyakojima', nameJp: '都島区' },
      { name: 'Fukushima', nameJp: '福島区' },
      { name: 'Konohana', nameJp: '此花区' },
      { name: 'Chuo', nameJp: '中央区' },
      { name: 'Nishi', nameJp: '西区' },
      { name: 'Minato', nameJp: '港区' },
      { name: 'Taisho', nameJp: '大正区' },
      { name: 'Tennoji', nameJp: '天王寺区' },
      { name: 'Naniwa', nameJp: '浪速区' },
      { name: 'Nishinari', nameJp: '西成区' },
      { name: 'Yodogawa', nameJp: '淀川区' },
      { name: 'Tsurumi', nameJp: '鶴見区' },
      { name: 'Suminoe', nameJp: '住之江区' },
      { name: 'Sumiyoshi', nameJp: '住吉区' },
      { name: 'Higashisumiyoshi', nameJp: '東住吉区' },
      { name: 'Ikuno', nameJp: '生野区' },
      { name: 'Asahi', nameJp: '旭区' },
      { name: 'Joto', nameJp: '城東区' },
      { name: 'Abeno', nameJp: '阿倍野区' },
      { name: 'Higashinari', nameJp: '東成区' },
      { name: 'Higashiyodogawa', nameJp: '東淀川区' },
      { name: 'Higashisumiyoshi', nameJp: '東住吉区' },
      { name: 'Hirano', nameJp: '平野区' }
    ]),
    svgPath: 'M225,210 L250,215 L245,235 L220,230 Z'
  },
  {
    id: 'hyogo',
    name: 'Hyogo',
    nameJp: '兵庫県',
    region: 'kinki',
    districts: createDistricts('hyogo', [
      { name: 'Kobe', nameJp: '神戸' },
      { name: 'Himeji', nameJp: '姫路' },
      { name: 'Nishinomiya', nameJp: '西宮' },
      { name: 'Amagasaki', nameJp: '尼崎' },
      { name: 'Toyooka', nameJp: '豊岡' },
      { name: 'Kinosaki', nameJp: '城崎' },
      { name: 'Ako', nameJp: '赤穂' },
      { name: 'Awaji Island', nameJp: '淡路島' },
      { name: 'Sumoto', nameJp: '洲本' },
      { name: 'Takarazuka', nameJp: '宝塚' }
    ]),
    svgPath: 'M185,195 L225,195 L220,225 L190,230 L180,210 Z'
  },
  {
    id: 'nara',
    name: 'Nara',
    nameJp: '奈良県',
    region: 'kinki',
    districts: createDistricts('nara', [
      { name: 'Nara', nameJp: '奈良' },
      { name: 'Yamatokoriyama', nameJp: '大和郡山' },
      { name: 'Kashihara', nameJp: '橿原' },
      { name: 'Ikoma', nameJp: '生駒' },
      { name: 'Yoshino', nameJp: '吉野' },
      { name: 'Tenri', nameJp: '天理' },
      { name: 'Sakurai', nameJp: '桜井' },
      { name: 'Gojo', nameJp: '五條' },
      { name: 'Kashiba', nameJp: '香芝' },
      { name: 'Uda', nameJp: '宇陀' }
    ]),
    svgPath: 'M245,235 L265,235 L260,260 L245,255 Z'
  },
  {
    id: 'wakayama',
    name: 'Wakayama',
    nameJp: '和歌山県',
    region: 'kinki',
    districts: createDistricts('wakayama', [
      { name: 'Wakayama', nameJp: '和歌山' },
      { name: 'Kainan', nameJp: '海南' },
      { name: 'Tanabe', nameJp: '田辺' },
      { name: 'Shingu', nameJp: '新宮' },
      { name: 'Koya', nameJp: '高野山' },
      { name: 'Shirahama', nameJp: '白浜' },
      { name: 'Iwade', nameJp: '岩出' },
      { name: 'Gobou', nameJp: '御坊' },
      { name: 'Arida', nameJp: '有田' },
      { name: 'Hashimoto', nameJp: '橋本' }
    ]),
    svgPath: 'M220,235 L245,240 L245,270 L225,280 L215,255 Z'
  },

  // Chugoku Region
  {
    id: 'tottori',
    name: 'Tottori',
    nameJp: '鳥取県',
    region: 'chugoku',
    districts: createDistricts('tottori', [
      { name: 'Tottori', nameJp: '鳥取' },
      { name: 'Yonago', nameJp: '米子' },
      { name: 'Kurayoshi', nameJp: '倉吉' },
      { name: 'Sakaiminato', nameJp: '境港' },
      { name: 'Yurihama', nameJp: '湯梨浜' },
      { name: 'Daisen', nameJp: '大山' },
      { name: 'Iwami', nameJp: '岩美' },
      { name: 'Misasa', nameJp: '三朝' },
      { name: 'Hokuei', nameJp: '北栄' },
      { name: 'Kotoura', nameJp: '琴浦' }
    ]),
    svgPath: 'M155,190 L185,195 L180,220 L150,215 Z'
  },
  {
    id: 'shimane',
    name: 'Shimane',
    nameJp: '島根県',
    region: 'chugoku',
    districts: createDistricts('shimane', [
      { name: 'Matsue', nameJp: '松江' },
      { name: 'Izumo', nameJp: '出雲' },
      { name: 'Hamada', nameJp: '浜田' },
      { name: 'Masuda', nameJp: '益田' },
      { name: 'Oda', nameJp: '大田' },
      { name: 'Gotsu', nameJp: '江津' },
      { name: 'Unnan', nameJp: '雲南' },
      { name: 'Iinan', nameJp: '飯南' },
      { name: 'Tsuwano', nameJp: '津和野' },
      { name: 'Okinoshima', nameJp: '隠岐の島' }
    ]),
    svgPath: 'M120,185 L155,190 L150,215 L115,210 Z'
  },
  {
    id: 'okayama',
    name: 'Okayama',
    nameJp: '岡山県',
    region: 'chugoku',
    districts: createDistricts('okayama', [
      { name: 'Okayama', nameJp: '岡山' },
      { name: 'Kurashiki', nameJp: '倉敷' },
      { name: 'Tsuyama', nameJp: '津山' },
      { name: 'Takahashi', nameJp: '高梁' },
      { name: 'Bizen', nameJp: '備前' },
      { name: 'Soja', nameJp: '総社' },
      { name: 'Mimasaka', nameJp: '美作' },
      { name: 'Ibara', nameJp: '井原' },
      { name: 'Asakuchi', nameJp: '浅口' },
      { name: 'Maniwa', nameJp: '真庭' }
    ]),
    svgPath: 'M180,225 L215,225 L210,250 L180,245 Z'
  },
  {
    id: 'hiroshima',
    name: 'Hiroshima',
    nameJp: '広島県',
    region: 'chugoku',
    districts: createDistricts('hiroshima', [
      { name: 'Hiroshima', nameJp: '広島' },
      { name: 'Fukuyama', nameJp: '福山' },
      { name: 'Kure', nameJp: '呉' },
      { name: 'Hatsukaichi', nameJp: '廿日市' },
      { name: 'Onomichi', nameJp: '尾道' },
      { name: 'Mihara', nameJp: '三原' },
      { name: 'Higashihiroshima', nameJp: '東広島' },
      { name: 'Akitakata', nameJp: '安芸高田' },
      { name: 'Takehara', nameJp: '竹原' },
      { name: 'Otake', nameJp: '大竹' }
    ]),
    svgPath: 'M140,225 L180,230 L175,260 L140,255 Z'
  },
  {
    id: 'yamaguchi',
    name: 'Yamaguchi',
    nameJp: '山口県',
    region: 'chugoku',
    districts: createDistricts('yamaguchi', [
      { name: 'Yamaguchi', nameJp: '山口' },
      { name: 'Shimonoseki', nameJp: '下関' },
      { name: 'Ube', nameJp: '宇部' },
      { name: 'Hofu', nameJp: '防府' },
      { name: 'Iwakuni', nameJp: '岩国' },
      { name: 'Hagi', nameJp: '萩' },
      { name: 'Kudamatsu', nameJp: '下松' },
      { name: 'Shunan', nameJp: '周南' },
      { name: 'Yanai', nameJp: '柳井' },
      { name: 'Suo-Oshima', nameJp: '周防大島' }
    ]),
    svgPath: 'M100,215 L140,220 L140,260 L105,260 L95,235 Z'
  },

  // Shikoku Region
  {
    id: 'tokushima',
    name: 'Tokushima',
    nameJp: '徳島県',
    region: 'shikoku',
    districts: createDistricts('tokushima', [
      { name: 'Tokushima', nameJp: '徳島' },
      { name: 'Naruto', nameJp: '鳴門' },
      { name: 'Anan', nameJp: '阿南' },
      { name: 'Mima', nameJp: '美馬' },
      { name: 'Awa', nameJp: '阿波' },
      { name: 'Yoshinogawa', nameJp: '吉野川' },
      { name: 'Miyoshi', nameJp: '三好' },
      { name: 'Komatsushima', nameJp: '小松島' },
      { name: 'Katsuura', nameJp: '勝浦' },
      { name: 'Naka', nameJp: '那賀' }
    ]),
    svgPath: 'M230,290 L260,285 L255,310 L235,315 Z'
  },
  {
    id: 'kagawa',
    name: 'Kagawa',
    nameJp: '香川県',
    region: 'shikoku',
    districts: createDistricts('kagawa', [
      { name: 'Takamatsu', nameJp: '高松' },
      { name: 'Marugame', nameJp: '丸亀' },
      { name: 'Sanuki', nameJp: 'さぬき' },
      { name: 'Kotohira', nameJp: '琴平' },
      { name: 'Zentsuji', nameJp: '善通寺' },
      { name: 'Kanonji', nameJp: '観音寺' },
      { name: 'Sakaide', nameJp: '坂出' },
      { name: 'Miki', nameJp: '三木' },
      { name: 'Ayagawa', nameJp: '綾川' },
      { name: 'Tonosho', nameJp: '土庄' }
    ]),
    svgPath: 'M200,275 L230,275 L230,295 L205,295 Z'
  },
  {
    id: 'ehime',
    name: 'Ehime',
    nameJp: '愛媛県',
    region: 'shikoku',
    districts: createDistricts('ehime', [
      { name: 'Matsuyama', nameJp: '松山' },
      { name: 'Imabari', nameJp: '今治' },
      { name: 'Uwajima', nameJp: '宇和島' },
      { name: 'Yawatahama', nameJp: '八幡浜' },
      { name: 'Dogo Onsen', nameJp: '道後温泉' },
      { name: 'Niihama', nameJp: '新居浜' },
      { name: 'Saijo', nameJp: '西条' },
      { name: 'Ozu', nameJp: '大洲' },
      { name: 'Seiyo', nameJp: '西予' },
      { name: 'Toon', nameJp: '東温' }
    ]),
    svgPath: 'M160,270 L200,275 L195,310 L165,305 Z'
  },
  {
    id: 'kochi',
    name: 'Kochi',
    nameJp: '高知県',
    region: 'shikoku',
    districts: createDistricts('kochi', [
      { name: 'Kochi', nameJp: '高知' },
      { name: 'Nankoku', nameJp: '南国' },
      { name: 'Shimanto', nameJp: '四万十' },
      { name: 'Sukumo', nameJp: '宿毛' },
      { name: 'Muroto', nameJp: '室戸' },
      { name: 'Aki', nameJp: '安芸' },
      { name: 'Susaki', nameJp: '須崎' },
      { name: 'Tosashimizu', nameJp: '土佐清水' },
      { name: 'Konan', nameJp: '香南' },
      { name: 'Tosa', nameJp: '土佐' }
    ]),
    svgPath: 'M165,305 L195,310 L190,340 L170,345 L160,320 Z'
  },

  // Kyushu Region
  {
    id: 'fukuoka',
    name: 'Fukuoka',
    nameJp: '福岡県',
    region: 'kyushu',
    districts: createDistricts('fukuoka', [
      { name: 'Fukuoka', nameJp: '福岡' },
      { name: 'Kitakyushu', nameJp: '北九州' },
      { name: 'Kurume', nameJp: '久留米' },
      { name: 'Dazaifu', nameJp: '太宰府' },
      { name: 'Yanagawa', nameJp: '柳川' },
      { name: 'Iizuka', nameJp: '飯塚' },
      { name: 'Tagawa', nameJp: '田川' },
      { name: 'Yame', nameJp: '八女' },
      { name: 'Asakura', nameJp: '朝倉' },
      { name: 'Chikugo', nameJp: '筑後' }
    ]),
    svgPath: 'M80,265 L110,260 L105,285 L75,280 Z'
  },
  {
    id: 'saga',
    name: 'Saga',
    nameJp: '佐賀県',
    region: 'kyushu',
    districts: createDistricts('saga', [
      { name: 'Saga', nameJp: '佐賀' },
      { name: 'Karatsu', nameJp: '唐津' },
      { name: 'Imari', nameJp: '伊万里' },
      { name: 'Takeo', nameJp: '武雄' },
      { name: 'Arita', nameJp: '有田' },
      { name: 'Kashima', nameJp: '鹿島' },
      { name: 'Ogi', nameJp: '小城市' },
      { name: 'Kanzaki', nameJp: '神埼' },
      { name: 'Yoshinogari', nameJp: '吉野ヶ里' },
      { name: 'Taku', nameJp: '多久' }
    ]),
    svgPath: 'M60,265 L80,265 L75,285 L55,280 Z'
  },
  {
    id: 'nagasaki',
    name: 'Nagasaki',
    nameJp: '長崎県',
    region: 'kyushu',
    districts: createDistricts('nagasaki', [
      { name: 'Nagasaki', nameJp: '長崎' },
      { name: 'Sasebo', nameJp: '佐世保' },
      { name: 'Shimabara', nameJp: '島原' },
      { name: 'Hirado', nameJp: '平戸' },
      { name: 'Goto Islands', nameJp: '五島列島' },
      { name: 'Omura', nameJp: '大村' },
      { name: 'Isahaya', nameJp: '諫早' },
      { name: 'Iki', nameJp: '壱岐' },
      { name: 'Tsushima', nameJp: '対馬' },
      { name: 'Minamishimabara', nameJp: '南島原' }
    ]),
    svgPath: 'M30,260 L60,265 L50,290 L25,285 Z'
  },
  {
    id: 'kumamoto',
    name: 'Kumamoto',
    nameJp: '熊本県',
    region: 'kyushu',
    districts: createDistricts('kumamoto', [
      { name: 'Kumamoto', nameJp: '熊本' },
      { name: 'Amakusa', nameJp: '天草' },
      { name: 'Aso', nameJp: '阿蘇' },
      { name: 'Kurokawa Onsen', nameJp: '黒川温泉' },
      { name: 'Hitoyoshi', nameJp: '人吉' },
      { name: 'Tamana', nameJp: '玉名' },
      { name: 'Yamaga', nameJp: '山鹿' },
      { name: 'Kikuchi', nameJp: '菊池' },
      { name: 'Yatsushiro', nameJp: '八代' },
      { name: 'Uto', nameJp: '宇土' }
    ]),
    svgPath: 'M75,285 L105,285 L100,325 L75,320 L70,300 Z'
  },
  {
    id: 'oita',
    name: 'Oita',
    nameJp: '大分県',
    region: 'kyushu',
    districts: createDistricts('oita', [
      { name: 'Oita', nameJp: '大分' },
      { name: 'Beppu', nameJp: '別府' },
      { name: 'Yufuin', nameJp: '由布院' },
      { name: 'Kunisaki', nameJp: '国東' },
      { name: 'Usa', nameJp: '宇佐' },
      { name: 'Hita', nameJp: '日田' },
      { name: 'Saiki', nameJp: '佐伯' },
      { name: 'Nakatsu', nameJp: '中津' },
      { name: 'Kitsuki', nameJp: '杵築' },
      { name: 'Usuki', nameJp: '臼杵' }
    ]),
    svgPath: 'M105,285 L140,275 L135,320 L100,325 Z'
  },
  {
    id: 'miyazaki',
    name: 'Miyazaki',
    nameJp: '宮崎県',
    region: 'kyushu',
    districts: createDistricts('miyazaki', [
      { name: 'Miyazaki', nameJp: '宮崎' },
      { name: 'Nichinan', nameJp: '日南' },
      { name: 'Hyuga', nameJp: '日向' },
      { name: 'Takachiho', nameJp: '高千穂' },
      { name: 'Aoshima', nameJp: '青島' },
      { name: 'Nobeoka', nameJp: '延岡' },
      { name: 'Kobayashi', nameJp: '小林' },
      { name: 'Ebino', nameJp: 'えびの' },
      { name: 'Kushima', nameJp: '串間' },
      { name: 'Saito', nameJp: '西都' }
    ]),
    svgPath: 'M115,320 L155,315 L160,365 L130,370 L120,340 Z'
  },
  {
    id: 'kagoshima',
    name: 'Kagoshima',
    nameJp: '鹿児島県',
    region: 'kyushu',
    districts: createDistricts('kagoshima', [
      { name: 'Kagoshima', nameJp: '鹿児島' },
      { name: 'Ibusuki', nameJp: '指宿' },
      { name: 'Kirishima', nameJp: '霧島' },
      { name: 'Sakurajima', nameJp: '桜島' },
      { name: 'Yakushima', nameJp: '屋久島' },
      { name: 'Amami Islands', nameJp: '奄美群島' },
      { name: 'Kanoya', nameJp: '鹿屋' },
      { name: 'Satsumasendai', nameJp: '薩摩川内' },
      { name: 'Izumi', nameJp: '出水' },
      { name: 'Akune', nameJp: '阿久根' }
    ]),
    svgPath: 'M75,320 L115,320 L110,360 L85,370 L70,350 Z'
  },
  {
    id: 'okinawa',
    name: 'Okinawa',
    nameJp: '沖縄県',
    region: 'kyushu',
    districts: createDistricts('okinawa', [
      { name: 'Naha', nameJp: '那覇' },
      { name: 'Nago', nameJp: '名護' },
      { name: 'Ishigaki', nameJp: '石垣' },
      { name: 'Miyakojima', nameJp: '宮古島' },
      { name: 'Kerama Islands', nameJp: '慶良間諸島' },
      { name: 'Okinawa', nameJp: '沖縄市' },
      { name: 'Uruma', nameJp: 'うるま' },
      { name: 'Ginowan', nameJp: '宜野湾' },
      { name: 'Tomigusuku', nameJp: '豊見城' },
      { name: 'Itoman', nameJp: '糸満' }
    ]),
    svgPath: 'M50,380 L90,385 L85,400 L55,395 Z'
  }
];

export const regionColors: Record<Region, string> = {
  hokkaido: '#FF6B6B',
  tohoku: '#4ECDC4',
  kanto: '#45B7D1',
  chubu: '#96CEB4',
  kinki: '#FFEAA7',
  chugoku: '#DDA0DD',
  shikoku: '#98D8C8',
  kyushu: '#F7DC6F'
};

export const regionNames: Record<Region, { name: string; nameJp: string }> = {
  hokkaido: { name: 'Hokkaido', nameJp: '北海道' },
  tohoku: { name: 'Tohoku', nameJp: '東北' },
  kanto: { name: 'Kanto', nameJp: '関東' },
  chubu: { name: 'Chubu', nameJp: '中部' },
  kinki: { name: 'Kinki', nameJp: '近畿' },
  chugoku: { name: 'Chugoku', nameJp: '中国' },
  shikoku: { name: 'Shikoku', nameJp: '四国' },
  kyushu: { name: 'Kyushu & Okinawa', nameJp: '九州・沖縄' }
};
