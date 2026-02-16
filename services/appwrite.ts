// track the searches made by user
import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_MOVIES_COLLECTION_ID!;
const FAVORITES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); // Your project ID

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        { count: existingMovie.count + 1 },
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("count"),
      Query.limit(5),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

// ==================== FAVORITES FUNCTIONS ====================

export const toggleFavorite = async (movie: {
  movie_id: number;
  title: string;
  poster_url: string;
  vote_average?: number;
}) => {
  try {
    const existingFavorites = await database.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      [Query.equal("movie_id", movie.movie_id)],
    );

    if (existingFavorites.documents.length > 0) {
      // remove from favorites
      await database.deleteDocument(
        DATABASE_ID,
        FAVORITES_COLLECTION_ID,
        existingFavorites.documents[0].$id,
      );
    } else {
      // Add to favorites
      await database.createDocument(
        DATABASE_ID,
        FAVORITES_COLLECTION_ID,
        ID.unique(),
        {
          movie_id: movie.movie_id,
          title: movie.title,
          poster_url: movie.poster_url,
          vote_average: Math.round((movie.vote_average ?? 0) * 10), // Convert to integer (e.g., 7.5 → 75)
        },
      );
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

export const checkIsFavorite = async (movieId: number): Promise<boolean> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      [Query.equal("movie_id", movieId)],
    );

    return result.documents.length > 0;
  } catch (error) {
    console.error("Error checking favorite:", error);
    return false;
  }
};

export const getFavoriteMovies = async (): Promise<Movie[]> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
    );
    return result.documents as unknown as Movie[];
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    return [];
  }
};
