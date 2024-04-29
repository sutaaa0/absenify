import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmtyState from "../../components/EmtyState";
import { searchAbsen } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import CardAbsen from "../../components/CardAbsen";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: dataAbsen, refetch } = useAppwrite(() => searchAbsen(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={dataAbsen}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <CardAbsen absensi={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-psemibold text-sm text-gray-100">Search Result</Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmtyState title="No Video Found" subtitle="No videos found for this search query" />}
      />
    </SafeAreaView>
  );
};

export default Search;
