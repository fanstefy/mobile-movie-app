import { icons } from "@/constants/icons";
import { toggleFavorite } from "@/services/appwrite";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const FavoriteCard = ({
  movie_id,
  poster_url,
  title,
  vote_average,
  onRemove,
}: FavoriteMovie & { onRemove: () => void }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) return;

    setIsRemoving(true);
    try {
      await toggleFavorite({
        movie_id,
        title,
        poster_url,
        vote_average,
      });

      // Notify parent to refresh the list
      if (onRemove) onRemove();
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <View className="w-[30%] relative">
      <Link href={`/movies/${movie_id}`} asChild>
        <TouchableOpacity>
          <Image
            source={{
              uri:
                poster_url ||
                "https://via.placeholder.com/600x400/1a1a1a/ffffff.png",
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
              {Math.round((vote_average ?? 0) / 10 / 2)}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
      {/* Remove Favorite Icon */}
      <TouchableOpacity
        onPress={handleRemove}
        className="absolute top-2 right-2 bg-red-400/80 px-2 py-1 rounded-full"
        disabled={isRemoving}
        activeOpacity={0.7}
      >
        <Text className="text-white text-sm font-bold">✕</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FavoriteCard;
