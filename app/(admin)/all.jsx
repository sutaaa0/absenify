import { View, Text, FlatList, Image, RefreshControl, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import { images } from "../../constants";
import EmtyState from "../../components/EmtyState";
import { getAbsenByDay, getAllAbsen, getAllUser } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CardAbsen from "../../components/CardAbsen";
import CardAdmin from "../../components/CardAdmin";

const All = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [day, setDay] = useState("");
  const { user } = useGlobalContext();
  const { data: absen, refetch: refetchAbsen } = useAppwrite(getAllAbsen);
  const { data: users, refetch: refetchUsers } = useAppwrite(getAllUser);
  const { data: absenByDay, refetch: refetchAbsenByDay } = useAppwrite(() => getAbsenByDay(day));

  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (day) {
      setIsLoading(true);
      setRefreshing(true);
      refetchAbsenByDay();
      refetchUsers()
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [day]);

  const onRefresh = async () => {
    setIsLoading(true);
    setRefreshing(true);
    await refetchAbsen();
    await refetchUsers();
    setIsLoading(false);
    if (day) {
      setIsLoading(true);
      await refetchAbsenByDay();
      setIsLoading(false);
    }
    setRefreshing(false);
  };

  const All = () => {
    setDay("");
  };
  const Senin = () => {
    setDay("Monday");
  };
  const Selasa = () => {
    setDay("Tuesday");
  };
  const Rabu = () => {
    setDay("Wednesday");
  };
  const Kamis = () => {
    setDay("Thursday");
  };
  const Jumat = () => {
    setDay("Friday");
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={day ? absenByDay : absen}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <CardAdmin absensi={item} />}
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
              <TouchableOpacity onPress={All} className={`text-center justify-center flex-1 items-center ${day === "" ? `bg-green-400 rounded` : null}`}>
                <Text className="font-psemibold">All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={Senin} className={`text-center justify-center flex-1 items-center ${day === "Monday" ? `bg-green-400 rounded` : null}`}>
                <Text className="font-psemibold">Senin</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={Selasa} className={`text-center justify-center flex-1 items-center ${day === "Tuesday" ? `bg-green-400 rounded` : null}`}>
                <Text className="font-psemibold">Selasa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={Rabu} className={`text-center justify-center flex-1 items-center ${day === "Wednesday" ? `bg-green-400 rounded` : null}`}>
                <Text className="font-psemibold">Rabu</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={Kamis} className={`text-center justify-center flex-1 items-center ${day === "Thursday" ? `bg-green-400 rounded` : null}`}>
                <Text className="font-psemibold">Kamis</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={Jumat} className={`text-center justify-center flex-1 items-center ${day === "Friday" ? `bg-green-400 rounded` : null}`}>
                <Text className="font-psemibold">Jum'at</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 20 }}>
            {day && absenByDay.length === 0 ? <EmtyState title="tidak ada data absen" subtitle="Lihaat hari lain" /> : null}
            {!day && absen.length === 0 ? <EmtyState title="tidak ada data absen" subtitle="Lihat hari lain" /> : null}
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} color="#fefefe" size="large" />}
    </SafeAreaView>
  );
};

export default All;
