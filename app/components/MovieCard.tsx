import { icons } from "@/constants/icons";
import { toggleFavorite } from "@/services/appwrite";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  initialIsFavorite = false,
}: Movie & { initialIsFavorite?: boolean }) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleFavoritePress = async (e: any) => {
    // Prevent navigation when pressing heart
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleFavorite({
        movie_id: id,
        title,
        poster_url: poster_path
          ? `https://image.tmdb.org/t/p/w500${poster_path}`
          : "https://via.placeholder.com/600x400/1a1a1a/ffffff.png",
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <View className="w-[30%] relative">
      <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity>
          <Image
            source={{
              uri: poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "https://via.placeholder.com/600x400/1a1a1a/ffffff.png",
            }}
            className="w-full h-48 rounded-lg"
            resizeMode="cover"
          />
          <Text className="text-white text-sm font-bold mt-2" numberOfLines={1}>
            {title}
          </Text>
          <View className="flex-row items-center justify-start gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-xs text-white font-bold uppercase">
              {Math.round(vote_average / 2)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-light-200">
              {release_date?.split("-")[0]}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>

      {/* Favorite Heart Icon */}
      <TouchableOpacity
        onPress={handleFavoritePress}
        className="absolute top-1 right-1 bg-black/60 p-1.5 rounded-full"
        activeOpacity={0.7}
      >
        <Text className="text-xl">{isFavorite ? "❤️" : "🤍"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieCard;
