import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { getAllUserIzin, getStatusUser, izin } from "../../lib/appwrite";
import { akhiriIzin } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";

const Izin = () => {
  const { data: Status, refetch: dataStatus } = useAppwrite(() => getStatusUser(user.$id));
  const { data: allStatus, refetch: dataAllStatus } = useAppwrite(() => getAllUserIzin(user.$id));
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    category: "", // Kategori izin
    description: "", // Deskripsi izin
  });

  const currentTime = moment().format("dddd, D MMM YYYY HH:mm a");
  const totalIzin = allStatus.length;

  const userId = user?.$id;
  const submitPermissionRequest = async () => {
    // Validasi form
    if (!form.category || !form.description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validasi kategori izin
    if (form.category !== "Sakit" && form.category !== "Izin") {
      Alert.alert("Error", "Please enter 'Sakit' or 'Izin' for the category!");
      return;
    }

    setIsLoading(true); // Set loading menjadi true saat mengirim permintaan izin

    try {
      // Kirim data izin ke backend untuk disimpan
      await izin(form, user, currentTime, totalIzin);
      dataStatus();
      Alert.alert("Success", "Permission request submitted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to submit permission request. Please try again later.");
    } finally {
      setForm({
        category: "",
        description: "",
      });
    }

    setIsLoading(false); // Set loading menjadi false setelah pengiriman permintaan izin selesai
  };

  const endIzin = async () => {
    setIsLoading(true);
    try {
      await akhiriIzin(userId);
      Alert.alert("Success", "Izin ended successfully");
      // Panggil ulang dataStatus setelah berhasil mengakhiri izin
      dataStatus();
    } catch (error) {
      Alert.alert("Error", "Failed to end izin. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="px-4 my-[140px] h-full">
          {Status === "Izin" || Status === "Sakit" ? (
            <View className="mt-[100px] w-full px-6 justify-center">
              <Text className="text-2xl font-pbold text-white text-center">Akhiri Izin</Text>
              <CustomButton title="Submit Request" handlePress={endIzin} containerStyles="mt-10" isLoading={isLoading} />
            </View>
          ) : (
            <>
              <Text className="text-2xl font-pbold text-white">Permission Request</Text>

              <FormField title="Category" value={form.category} placeholder="Kategori Sakit/Izin" handleChangeText={(value) => setForm({ ...form, category: value })} otherStyles="mt-10" />

              <FormField title="Description" value={form.description} placeholder="Keterangan" handleChangeText={(value) => setForm({ ...form, description: value })} otherStyles="mt-10" />

              <CustomButton title="Submit Request" handlePress={submitPermissionRequest} containerStyles="mt-10" isLoading={isLoading} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Izin;
