export interface BoardGame {
  id: string;
  name: string;
  thumbnail?: string;           
  year_published?: string;      
  min_players?: number;         
  max_players?: number;         
  min_playtime?: number;        
  max_playtime?: number;
  description_preview?: string;
  price?: number;               
}
