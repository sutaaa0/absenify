import { View, Text, FlatList, Image, RefreshControl, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";

import { images } from "../../constants";
import EmtyState from "../../components/EmtyState";
import { getAllPosts, absen, getUserLatestAbsen } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import moment from "moment";
import { useGlobalContext } from "../../context/GlobalProvider";
import * as Location from "expo-location";
import { Redirect, router } from "expo-router";

const Home = () => {
  const { user } = useGlobalContext();

  if (user?.username === "admin") {
    return <Redirect href="/all" />;
  }

  console.log(user?.username)


  // const [absen, setAbsen] = useState(false)  fix fetch last absen
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isInOffice, setIsInOffice] = useState(false);

  const officeLatitude = -6.834014078019199;
  const officeLongitude = 107.99978766232034;
  const maxDistance = 1000; // Misalnya, jarak maksimum dalam meter

  const [currentDateTime, setcurrentDateTime] = useState(moment());

  const { data: posts, refetch: dataAllAbsen } = useAppwrite(getAllPosts);

  const [refreshing, setRefreshing] = useState(false);
  const [lastAbsen, setLastAbsen] = useState("");

  const { data: dataAbsen, refetch: dataLastAbsen } = useAppwrite(async () => await getUserLatestAbsen(user.$id));

  // cek absen terakhir

  useEffect(() => {
    if (dataAbsen.length > 0) {
      const latestAbsen = dataAbsen[0].waktuabsen.slice(0, 19);
      setLastAbsen(latestAbsen);
    }
  }, [dataAbsen]);

  // console.log(lastAbsen)
  useEffect(() => {
    const time = setInterval(() => {
      setcurrentDateTime(moment());
    }, 1000);

    return () => clearInterval(time);
  }, []);

  const waktu = currentDateTime.format("dddd, D MMM YYYY HH:mm a");
  const hari = currentDateTime.format("dddd");

  // mendapatkan lokasi user
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Izin untuk mengakses lokasi ditolak");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
        checkInOffice(location.coords);
      } catch (error) {
        console.log("Gagal mendapatkan lokasi:", error.message);
      }
    })();
  }, []);

  // mengecek lokasi user dengan kantor(lokasi yang sudah di tetapkan untuk melakukan absen)
  const checkInOffice = (userLocation) => {
    const distance = getDistance(userLocation.latitude, userLocation.longitude, officeLatitude, officeLongitude);
    setIsInOffice(distance <= maxDistance);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius bumi dalam meter
    const φ1 = (lat1 * Math.PI) / 180; // Convert latitude ke radian
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Jarak dalam meter
  };

  // fungsi refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await dataAllAbsen();
    await dataLastAbsen();
    setRefreshing(false);
  };

  // fungsi untuk mementukan keterangan telat/tidak
  const timeAbsen = (waktu) => {
    const jam = waktu.slice(20, 22);
    const menit = waktu.slice(23, 25);
    console.log(jam);
    let keterangan;

    if (jam === "07" && menit === "00") {
      keterangan = "Tepat Waktu";
    } else {
      const newJam = parseInt(jam) - 7 + " jam";
      const newMenit = parseInt(menit) - 0 + " menit";
      keterangan = `Telat ${newJam} ${newMenit}`;
    }

    return keterangan;
  };

  const isWithinWorkingHours = (time) => {
    const hour = parseInt(time.split(":")[0]); // Ambil jam dari waktu
    // Tentukan jam kerja, misalnya dari jam 7 pagi hingga jam 5 sore
    const startWorkingHour = 7;
    const endWorkingHour = 17;

    // Periksa apakah jam berada di dalam rentang jam kerja
    return hour >= startWorkingHour && hour < endWorkingHour;
  };

  const waktuUser = currentDateTime.format("HH:mm");
  const isWorkingHours = isWithinWorkingHours(waktuUser);

  const ButtonAbsen = () => {
    if (lastAbsen === waktu.slice(0, 19)) {
      return (
        <TouchableOpacity onPress={() => absen(user, waktu, timeAbsen(waktu), hari)} disabled={true} className={`border justify-center items-center bg-green-500 border-gray-500 p-5 rounded-3xl`}>
          <Text className="text-white text-center font-psemibold text-2xl">Sudah Absen</Text>
        </TouchableOpacity>
      );
    } else if (!isWorkingHours) {
      return (
        <TouchableOpacity onPress={() => absen(user, waktu, timeAbsen(waktu), hari)} disabled={true} className={`border justify-center items-center bg-red-500 border-gray-500 p-5 rounded-3xl`}>
          <Text className="text-white text-center font-psemibold text-2xl">Jam kerja sudah terlewat</Text>
        </TouchableOpacity>
      );
    } else if (!isInOffice) {
      return (
        <TouchableOpacity onPress={() => absen(user, waktu, timeAbsen(waktu), hari)} disabled={true} className={`border justify-center items-center bg-red-500 border-gray-500 p-5 rounded-3xl`}>
          <Text className="text-white text-center font-psemibold text-2xl">Lokasi anda di luar jangkauan</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => absen(user, waktu, timeAbsen(waktu), hari)} className={`border justify-center items-center border-gray-500 p-5 rounded-3xl`}>
          <Text className="text-white text-center font-psemibold text-2xl">Click Here</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
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

            <View className=" justify-center gap-y-2 items-center">
              <Text className="text-base text-gray-200 font-psemibold">{currentDateTime.format("dddd, D MMM YYYY")}</Text>
              <Text className="text-6xl text-gray-300 font-psemibold p-2">{currentDateTime.format("HH:mm a")}</Text>
              <View>
                <ButtonAbsen />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmtyState title="tidak ada data absen" subtitle="segera lakukan absen" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Home;
