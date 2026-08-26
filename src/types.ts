export interface SongTrack {
  id: string;
  title: string;
  movie: string;
  singers: string;
  year: number;
  duration: string;
  youtubeId: string;
  startSeconds?: number;
  vibe: string;
  dialogue?: string;
}

export type AtmosphereMode = 'midnight' | 'golden' | 'foggy';

export interface NostalgicMemory {
  id: string;
  hindiTitle: string;
  englishTranslation: string;
  story: string;
  tag: string;
  icon: string;
  timeContext: string;
}

export interface BusTicketData {
  ticketNumber: string;
  passengerName: string;
  busService: string;
  fromCity: string;
  toCity: string;
  seatNumber: string;
  departureTime: string;
  date: string;
  fare: string;
  platform: string;
}

export interface AmbientSettings {
  engineVolume: number;
  rainVolume: number;
  cricketsVolume: number;
  tapeHissVolume: number;
  busSpeakerEffect: boolean;
  wiperActive: boolean;
}
