const recipientName = 'Sarah';

export interface Letter {
  id: string;
  heading: string;
  body: string;
}

export interface Photo {
  id: string;
  src: string;
  caption: string;
}

export interface ValentineContent {
  recipientName: string;
  landing: {
    heading: string;
    subheading: string;
    buttonText: string;
  };
  photos: {
    heading: string;
    subheading: string;
    photos: Photo[];
  };
  loveNote: {
    heading: string;
    letters: Letter[];
    gifUrl?: string;
  };
  proposal: {
    question: string;
    yesButton: string;
    noButton: string;
    tryAgainMessage: string;
  };
  celebration: {
    message: string;
    datePlan: {
      enabled: boolean;
      activities: Array<{
        icon: 'calendar' | 'map' | 'clock';
        title: string;
        description: string;
      }>;
    };
  };
}

export const defaultValentineContent: ValentineContent = {
  recipientName,

  landing: {
    heading: 'Hey [Name]… I Have Something to Ask You 💖',
    subheading: 'Take a journey through our memories together',
    buttonText: 'Click to Continue',
  },

  photos: {
    heading: 'Our Beautiful Memories',
    subheading: 'Every moment with you is a treasure',
    photos: [
      {
        id: 'photo-1',
        src: '/assets/photos/photo-1.jpg',
        caption: 'The day we first met ✨',
      },
      {
        id: 'photo-2',
        src: '/assets/photos/photo-2.jpg',
        caption: 'Our favorite coffee spot ☕',
      },
      {
        id: 'photo-3',
        src: '/assets/photos/photo-3.jpg',
        caption: 'Sunset walks together 🌅',
      },
    ],
  },

  loveNote: {
    heading: 'A Letter From My Heart',
    letters: [
      {
        id: 'letter-1',
        heading: 'To My Dearest',
        body: `Dear ${recipientName},

From the moment I met you, my life has been filled with joy, laughter, and endless happiness. You bring light to my darkest days and make every moment we share feel magical.

Your smile brightens my world, your laugh is my favorite sound, and your presence makes everything better. I cherish every conversation, every adventure, and every quiet moment we spend together.

You inspire me to be a better person, and I'm grateful for every second I get to spend with you. Thank you for being you – kind, beautiful, and absolutely amazing.

With all my love,
Your Valentine 💕`,
      },
    ],
    gifUrl: '/assets/gifs/cute-bear.gif',
  },

  proposal: {
    question: 'Will You Be My Valentine?',
    yesButton: 'YES 💘',
    noButton: 'NO',
    tryAgainMessage: 'Try Again 😜',
  },

  celebration: {
    message: 'Yay! You just made me the happiest person 💕',
    datePlan: {
      enabled: true,
      activities: [
        {
          icon: 'calendar' as const,
          title: 'When: February 14th, 2026',
          description: "Valentine's Day – the perfect day to celebrate us!",
        },
        {
          icon: 'map' as const,
          title: 'Where: Our Favorite Restaurant',
          description: "I've made reservations at that cozy Italian place you love. Candlelit dinner for two! 🕯️",
        },
        {
          icon: 'clock' as const,
          title: 'Evening Stroll',
          description: "After dinner, let's take a romantic walk under the stars, just like we always do. 🌟",
        },
      ],
    },
  },
};

// Legacy export for backward compatibility
export const valentineContent = defaultValentineContent;
