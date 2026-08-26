import { SongTrack, NostalgicMemory } from '../types';

// The primary YouTube video from the user prompt: https://youtu.be/uIYFObB-yv0
export const MAIN_YOUTUBE_ID = 'uIYFObB-yv0';

export const PLAYLIST_TRACKS: SongTrack[] = [
  {
    id: 'track-main',
    title: "Bus Driver's Official Highway Mixtape",
    movie: '90s Bollywood Night Bus Special',
    singers: 'Kumar Sanu, Alka Yagnik, Udit Narayan, Sonu Nigam',
    year: 1996,
    duration: 'Full Mixtape (1:12:45)',
    youtubeId: 'uIYFObB-yv0',
    vibe: 'Iconic 1:00 AM Highway Groove',
    dialogue: '"Driver sir, please turn the volume up a little more!"'
  },
  {
    id: 'track-1',
    title: 'Chura Ke Dil Mera',
    movie: 'Main Khiladi Tu Anari',
    singers: 'Kumar Sanu, Alka Yagnik',
    year: 1994,
    duration: '5:42',
    youtubeId: '0gQZvd_y_rY',
    vibe: 'Pulsing Highway Beat',
    dialogue: 'Speedometer crossing 80 km/h on empty GT Karnal Road'
  },
  {
    id: 'track-2',
    title: 'Tip Tip Barsa Paani',
    movie: 'Mohra',
    singers: 'Udit Narayan, Alka Yagnik',
    year: 1994,
    duration: '6:15',
    youtubeId: 'k2qgadSvnyU',
    vibe: 'Rain on Bus Windshield',
    dialogue: 'Raindrops racing across the glass pane as wipers sway'
  },
  {
    id: 'track-3',
    title: 'Pardesi Pardesi',
    movie: 'Raja Hindustani',
    singers: 'Kumar Sanu, Alka Yagnik, Sapna Awasthi',
    year: 1996,
    duration: '7:30',
    youtubeId: 'Wd716pE5U-U',
    vibe: 'Heartbreak at 2:00 AM',
    dialogue: 'The entire bus is sleeping except the driver and you'
  },
  {
    id: 'track-4',
    title: 'Ghar Se Nikalte Hi',
    movie: 'Papa Kehte Hain',
    singers: 'Udit Narayan',
    year: 1996,
    duration: '5:10',
    youtubeId: 'cNu4L3x4f1A',
    vibe: 'Window Breeze Nostalgia',
    dialogue: 'Cool mountain air blowing through the sliding glass gap'
  },
  {
    id: 'track-5',
    title: 'Aankhon Ki Gustakhiyan',
    movie: 'Hum Dil De Chuke Sanam',
    singers: 'Kumar Sanu, Kavita Krishnamurthy',
    year: 1999,
    duration: '5:00',
    youtubeId: 'T85yVbWwGq0',
    vibe: 'Melodic Ghats Cruise',
    dialogue: 'Winding through the misty hairpins of Murthal bypass'
  },
  {
    id: 'track-6',
    title: 'O O Jaane Jaana',
    movie: 'Pyaar Kiya To Darna Kya',
    singers: 'Kamaal Khan',
    year: 1998,
    duration: '5:46',
    youtubeId: 'k4dD_D55EwE',
    vibe: 'High-Bass Driver Energy',
    dialogue: 'Subwoofer vibrating under the wooden passenger floor'
  },
  {
    id: 'track-7',
    title: 'Aate Jaate Hanste Gaate',
    movie: 'Maine Pyar Kiya',
    singers: 'S. P. Balasubrahmanyam, Lata Mangeshkar',
    year: 1989,
    duration: '4:52',
    youtubeId: 'l1lCjWzM7_U',
    vibe: 'Golden Dawn Mist (4:30 AM)',
    dialogue: 'Dusk turning to dawn with tea steam at the milestone'
  },
  {
    id: 'track-8',
    title: 'Sandese Aate Hain',
    movie: 'Border',
    singers: 'Sonu Nigam, Roop Kumar Rathod',
    year: 1997,
    duration: '10:18',
    youtubeId: 'd66W0_N_mFk',
    vibe: 'Late Night Long Journey Classic',
    dialogue: 'Mile marker 240 KM: Highway dhaba neon flashing ahead'
  }
];

export const NOSTALGIC_MEMORIES: NostalgicMemory[] = [
  {
    id: 'mem-1',
    title: 'Cold Window Breeze & Soulful 90s Melodies',
    subtitle: 'The authentic window seat experience on late-night highway runs',
    story: 'Sitting by the rattling aluminum window with your forehead resting against the cool glass. The midnight highway breeze carries the scent of damp earth and eucalyptus trees, while classic 90s cassette melodies echo warmly from the wooden front cabin speakers.',
    tag: 'Window Seat Nostalgia',
    icon: 'Wind',
    timeContext: '01:45 AM • NH-44 Highway'
  },
  {
    id: 'mem-2',
    title: 'Steaming Ginger Chai at 2:30 AM Dhaba Halt',
    subtitle: 'Midnight tea stop at Sher-E-Punjab roadside eatery',
    story: 'The bus engine idles with a heavy rhythmic diesel hum. Passengers step out into the crisp mountain air toward glowing yellow tungsten lights. Freshly brewed ginger tea in terracotta kulhads and sizzling butter parathas on steel thalis.',
    tag: 'Highway Dhaba Stop',
    icon: 'Coffee',
    timeContext: '02:30 AM • Highway Dhaba Stop'
  },
  {
    id: 'mem-3',
    title: 'The Driver’s Legendary Musical Air Horn',
    subtitle: 'Pneumatic 4-tone melody piercing the midnight fog',
    story: 'Two confident taps on the steering wheel air horn: "Poo-Poo-Peee-Poo!" High-beam halogen headlights flash through the thick highway mist, clearing the overtaking lane with unmatched highway swagger.',
    tag: 'Highway Air Horn',
    icon: 'Volume2',
    timeContext: '03:15 AM • Karnal Bypass'
  },
  {
    id: 'mem-4',
    title: 'Conductor’s Brass Whistle & Metal Ticket Puncher',
    subtitle: 'The mechanical sounds of late-night boarding',
    story: 'A sharp "Phweeee-phweeeet!" whistle signals the driver to roll out. The rhythmic metallic click of the conductor’s handheld puncher creates crisp perforated holes on thin souvenir paper tickets.',
    tag: 'Conductor Whistle',
    icon: 'Ticket',
    timeContext: 'Departing Terminal'
  },
  {
    id: 'mem-5',
    title: 'Marigold Garland & Dashboard Sacred Shrine',
    subtitle: 'Illuminated dashboard idol watching over the night ride',
    story: 'Swaying gently with every hairpin turn and road bump. A glowing tiny LED diya illuminates the sacred dashboard shrine with fresh marigold flowers, blessing the long journey across the mountain ghats.',
    tag: 'Highway Blessing',
    icon: 'Shield',
    timeContext: 'Driver Cabin Shrine'
  },
  {
    id: 'mem-6',
    title: 'First Golden Light & Condensation on Glass',
    subtitle: 'Waking up to misty mountain pine valleys at dawn',
    story: 'Waking up as the morning sun casts golden beams across the dashboard. Drawing smiling faces on the foggy condensation of the bus window while rolling into the mountain valleys.',
    tag: 'Dawn Awakening',
    icon: 'Sunrise',
    timeContext: '05:30 AM • Mountain Valley'
  }
];

export const TRUCK_ART_SLOGANS = [
  'HORN OK PLEASE',
  'KEEP DISTANCE • SOUND HORN BEFORE OVERTAKING',
  'LOOK WITH RESPECT • DRIVE WITH CARE',
  'MOTHER’S BLESSINGS (MAA KA AASHIRWAD)',
  'OVERTAKE WITH SKILL • SAFETY FIRST',
  'SPEED 40 KMPH • PUSHPAK HIGHWAY EXPRESS',
  'QUEEN OF THE NIGHT • KING OF THE HIGHWAY',
  'PEACE TO ALL TRAVELERS • JAI BHOLE'
];
