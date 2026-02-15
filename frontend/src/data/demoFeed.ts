export interface FeedPost {
  id: string;
  author: string;
  content: string;
  dateLabel?: string;
  /** Optional profile image URL (cute/funny avatars for some posts) */
  avatarUrl?: string;
}

export const DEMO_FEED: FeedPost[] = [
  {
    id: '1',
    author: 'MayaStyles',
    dateLabel: 'Today',
    avatarUrl: 'https://api.dicebear.com/7.x/lorelei/png?seed=flower&backgroundColor=ffdfbf',
    content: 'Do you want to look your best on the first date? Color seasons may be the key to your confidence! Color analysis focusses on the undertone, value, and intensity of your natural features.',
  },
  {
    id: '2',
    author: 'CoolToneAlex',
    dateLabel: 'Today',
    content: 'Undertones can either look cool or warm. Does silver or gold look better on you? Silver is cool and gold is warm.',
  },
  {
    id: '3',
    author: 'GrayscaleJade',
    dateLabel: 'Today',
    content: 'Values can be either dark or light. Turn an image of you into grayscale and see whether you have overall darker or lighter features. Most people are towards the middle but lean in a certain direction. Light can also refer to low contrast features while dark is high contrast features.',
  },
  {
    id: '4',
    author: 'SoftOrBright',
    dateLabel: 'Today',
    avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/png?seed=sparkles&backgroundColor=ffd5dc',
    content: 'Intensity can either be soft or bright. Do your features stand out, or are they more delicate?',
  },
  {
    id: '5',
    author: 'SeasonalSam',
    dateLabel: 'Today',
    content: 'Summer: light, soft, cool\n\nSpring: light, bright, warm\n\nAutumn: dark, soft, warm\n\nWinter: dark, bright, cool',
  },
  {
    id: '6',
    author: 'PalettePro',
    dateLabel: 'Today',
    content: 'People usually lean towards one of the seasonal descriptors, which is a main characteristic. For example, someone who has darker, softer, and warmer features is an Autumn. However, this person has very delicate features and needs to wear extremely soft colors to match their natural characteristics. This person is called a Soft Autumn, and can wear all soft pallets, including Soft Summer.',
  },
  {
    id: '7',
    author: 'TrueSpringFan',
    dateLabel: 'Today',
    content: 'On rare occasions, a person will be equally all the descriptors in a season. For example, someone who is equally light, bright, and warm will be a True Spring. This person cannot share a pallet from another season.',
  },
  {
    id: '8',
    author: 'ColorCurious',
    dateLabel: 'Today',
    content: 'What is your color season? Share in a comment!',
  },
];
