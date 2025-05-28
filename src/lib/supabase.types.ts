import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T];

// Define item type from database schema
export type Item = Tables<'items'> & {
  categories: Tables<'categories'>;
  profiles: Tables<'profiles'>;
};

// Define category type from database schema
export type Category = Tables<'categories'>;

// Define profile type from database schema
export type Profile = Tables<'profiles'>;

// Define booking type from database schema
export type Booking = Tables<'bookings'>;

// Define review type from database schema
export type Review = Tables<'reviews'> & {
  profiles: Tables<'profiles'>;
};

// Function return types
export type CalculateAverageRatingFn = Functions<'calculate_average_rating'>;
