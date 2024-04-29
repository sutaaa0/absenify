import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmtyState from "../../components/EmtyState";
import { getAllUserIzin, getStatusUser, getUserAbsen, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import CardAbsen from "../../components/CardAbsen";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import CardInfo from "../../components/CardInfo";

import { router } from "expo-router";
const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: dataAbsen, refetch: userAbsen } = useAppwrite(() => getUserAbsen(user.$id));
  const { data: Status } = useAppwrite(() => getStatusUser(user.$id));
  const { data: allStatus, refetch: dataAllStatus } = useAppwrite(() => getAllUserIzin(user.$id));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsLoading(true);
    setRefreshing(true);
    await userAbsen();
    await dataAllStatus();
    setIsLoading(false);
    setRefreshing(false);
  };

  const Izin = () => {
    router.push("/izin");
  };

  const logout = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={dataAbsen}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <CardAbsen absensi={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <View className=" flex-row justify-between items-center w-full px-4">
              <TouchableOpacity className=" mb-10" onPress={Izin}>
                <Image source={icons.check} className="w-9 h-9" resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity className=" mb-10" onPress={logout}>
                <Image source={icons.logout} className="w-6 h-6" resizeMode="contain" />
              </TouchableOpacity>
            </View>

            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image source={{ uri: user?.avatar }} className="w-[90%] h-[90%] rounded" resizeMode="cover" />
            </View>

            <CardInfo title={user?.username} containerStyles="mt-5" titleStyles="text-lg" />
            <View className="mt-5 flex-row">
              <CardInfo title={dataAbsen.length || 0} containerStyles="mr-10" subtitle="Data Absen" titleStyles="text-xl" />
              <CardInfo title={allStatus.length || 0} containerStyles="mr-10" subtitle="Data Izin" titleStyles="text-xl" />
              <CardInfo title={Status} containerStyles="mr-10" subtitle="Status" titleStyles="text-xl" subtitleStyles="" />
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmtyState title="tidak ada data absen" subtitle="segera lakukan absen" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} color="#fefefe" size="large" />}
    </SafeAreaView>
  );
};

export default Profile;
