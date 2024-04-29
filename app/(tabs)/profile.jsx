import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmtyState from "../../components/EmtyState";
import { getAllUserIzin, getStatusUser, getUserAbsen, izin, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import CardAbsen from "../../components/CardAbsen";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import CardInfo from "../../components/CardInfo";

import { router } from "expo-router";
import CardIzin from "../../components/CardIzin";
import { Databases } from "react-native-appwrite";
const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: dataAbsen, refetch: dataAbsenUser } = useAppwrite(() => getUserAbsen(user.$id));
  const [data, setData] = useState(null);
  const [key, setKey] = useState("");
  const { data: Status, refetch: dataStatus } = useAppwrite(() => getStatusUser(user.$id));
  const { data: allStatus, refetch: dataAllStatus } = useAppwrite(() => getAllUserIzin(user.$id));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsLoading(true);
    setRefreshing(true);
    await dataAbsenUser();
    await dataAllStatus();
    await dataStatus();
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

  const handleBtnStatus = () => {
    setData(Status);
    setKey("dataStatus");
  };
  const handleBtnAbsen = () => {
    setData(dataAbsen);
    setKey("dataAbsen");
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      {key === "dataAbsen" ? (
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
                <CardInfo title={dataAbsen.length || 0} containerStyles="mr-10" subtitle="Data Absen" titleStyles="text-xl" handlePress={handleBtnAbsen} />
                <CardInfo title={allStatus.length || 0} containerStyles="mr-10" subtitle="Total Izin" titleStyles="text-xl" handlePress={handleBtnStatus} />
                <CardInfo title={Status} containerStyles="mr-10" subtitle="Status" titleStyles="text-xl" />
              </View>
            </View>
          )}
          ListEmptyComponent={() => <EmtyState title="tidak ada data absen" subtitle="segera lakukan absen" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : key === "dataStatus" ? (
        <FlatList
          data={allStatus}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <CardIzin izin={item} />}
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
                <CardInfo title={dataAbsen.length || 0} containerStyles="mr-10" subtitle="Data Absen" titleStyles="text-xl" handlePress={handleBtnAbsen} />
                <CardInfo title={allStatus.length || 0} containerStyles="mr-10" subtitle="Total Izin" titleStyles="text-xl" handlePress={handleBtnStatus} />
                <CardInfo title={Status} containerStyles="mr-10" subtitle="Status" titleStyles="text-xl" />
              </View>
            </View>
          )}
          ListEmptyComponent={() => <EmtyState title="tidak ada data absen" subtitle="segera lakukan absen" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
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
                <CardInfo title={dataAbsen.length || 0} containerStyles="mr-10" subtitle="Data Absen" titleStyles="text-xl" handlePress={handleBtnAbsen} />
                <CardInfo title={allStatus.length || 0} containerStyles="mr-10" subtitle="Total Izin" titleStyles="text-xl" handlePress={handleBtnStatus} />
                <CardInfo title={Status} containerStyles="mr-10" subtitle="Status" titleStyles="text-xl" />
              </View>
            </View>
          )}
          ListEmptyComponent={() => <EmtyState title="tidak ada data absen" subtitle="segera lakukan absen" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} color="#fefefe" size="large" />}
    </SafeAreaView>
  );
};

export default Profile;
