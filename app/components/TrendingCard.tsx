import { images } from "@/constants/images";
import { toggleFavorite } from "@/services/appwrite";
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const TrendingCard = ({
  movie: { movie_id, title, poster_url },
  index,
  initialIsFavorite = false,
}: TrendingCardProps & { initialIsFavorite?: boolean }) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleFavoritePress = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleFavorite({
        movie_id,
        title,
        poster_url,
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <View className="w-32 relative pl-5">
      <Link href={`/movies/${movie_id}`} asChild>
        <TouchableOpacity>
          <Image
            source={{ uri: poster_url }}
            className="w-32 h-48 rounded-lg"
            resizeMode="cover"
          />
          <View className="absolute bottom-14 -left-3.5 px-2 py-1 rounded-full">
            <MaskedView
              maskElement={
                <Text className="text-white text-6xl font-bold">
                  {index + 1}
                </Text>
              }
            >
              <Image
                source={images.rankingGradient}
                className="size-14"
                resizeMode="cover"
              />
            </MaskedView>
          </View>

          <Text
            className="text-sm font-bold mt-2 text-light-200"
            numberOfLines={2}
          >
            {title}
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Favorite Heart Icon */}
      <TouchableOpacity
        onPress={handleFavoritePress}
        className="absolute top-2 -right-4 bg-black/50 p-2 rounded-full"
      >
        <Text className="text-2xl">{isFavorite ? "❤️" : "🤍"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TrendingCard;
