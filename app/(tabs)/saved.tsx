import { icons } from "@/constants/icons";
import { getFavoriteMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FavoriteCard from "../components/FavoriteCard";

const Saved = () => {
  const {
    data: favorites,
    loading,
    error,
    refetch,
  } = useFetch(getFavoriteMovies);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  if (loading) {
    return (
      <View className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-primary flex-1 justify-center items-center px-10">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <View className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image source={icons.save} className="size-10" tintColor="#fff" />
          <Text className="text-gray-500 text-base">No Saved Movies</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1 px-10 pt-36">
      <View className="flex justify-center items-center flex-1 flex-col gap-5 mt-8">
        <Image source={icons.save} className="size-10" tintColor="#fff" />
        <Text className="text-gray-500 text-base mt-4">Saved Movies</Text>
      </View>

      {favorites && (
        <>
          <Text className="text-white text-lg font-bold mb-3 mt-12">
            Favorite Movies
          </Text>
          <FlatList
            data={favorites}
            renderItem={({ item }) => (
              <FavoriteCard {...item} onRemove={refetch} />
            )}
            keyExtractor={(item) => item.movie_id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
          />
        </>
      )}
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({});
