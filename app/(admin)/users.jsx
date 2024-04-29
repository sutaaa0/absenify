import { View, Text, FlatList, Image, RefreshControl, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import { images } from "../../constants";
import EmtyState from "../../components/EmtyState";
import { getAllUser, getAllUserByStatus } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CardUserKerja from "../../components/CardUserKerja";

const Izin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const { user } = useGlobalContext();
  const { data: users, refetch: refetchUsers } = useAppwrite(() => getAllUser());
  const { data: userByFilter, refetch: refetchAllUser } = useAppwrite(() => getAllUserByStatus(filter));
  const [dataAllUser, setDataAllUser] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (filter) {
      setIsLoading(true);
      setRefreshing(true);
      refetchAllUser();
      refetchUsers()
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  const onRefresh = async () => {
    setIsLoading(true);
    setRefreshing(true);
    await refetchUsers();
    await refetchAllUser();
    setIsLoading(false);
    setRefreshing(false);
  };

  const AllUser = async () => {
    setFilter("");
    setDataAllUser();
  };
  const handleKerja = async () => {
    setFilter("Kerja");
  };
  const handleIzin = async () => {
    setFilter("Izin");
  };
  const handleSakit = async () => {
    setFilter("Sakit");
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={filter ? userByFilter : users }
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <CardUserKerja Users={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-psemibold text-sm text-gray-100">Welcome Back,</Text>
                <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
              </View>

              <View className="mt-1.5">
                <Image source={images.tes3} className="w-12 h-12" resizeMode="contain" />
              </View>
            </View>
            <SearchInput />
            <View className="w-full gap-x-1 h-10 justify-center mx-auto flex-row items-center rounded-xl bg-white ">
              <TouchableOpacity onPress={AllUser} className={`text-center justify-center flex-1 items-center ${filter === "" ? `bg-green-400 rounded` : null}`}>
                <Text className="font-psemibold">AllUser</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleKerja} className={`text-center justify-center flex-1 items-center ${filter === "Kerja" ? `bg-green-400 rounded` : null}`}>
                <Text className="font-psemibold">Kerja</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleIzin} className={`text-center justify-center flex-1 items-center ${filter === "Izin" ? `bg-green-400 rounded` : null}`}>
                <Text className="font-psemibold">Izin</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSakit} className={`text-center justify-center flex-1 items-center ${filter === "Sakit" ? `bg-green-400 rounded` : null}`}>
                <Text className="font-psemibold">Sakit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmtyState title="tidak ada users" subtitle="Tidak ada" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} color="#fefefe" size="large" />}
    </SafeAreaView>
  );
};

export default Izin;
