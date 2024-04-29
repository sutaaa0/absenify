import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const { user } = useGlobalContext();
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full relative">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image source={images.tes1} className="w-[400px] h-[720px] -top-[176px] absolute z-1" resizeMode="cover" />
          <Image source={images.tes1} className="w-[400px] h-[720px] -top-[70px] absolute " resizeMode="cover" />
          {/* <Image source={images.logo} className="w-[130px] h-[84px]" resizeMode="contain" />
          <Image source={images.cards} className="max-w-[380px] w-full h-[300px]" resizeMode="contain" /> */}

          <Text className="text-sm font-pregular text-gray-100 mt-[480px] text-center">"Buka dunia manajemen kehadiran yang lancar dengan Absenify, Di mana efisiensi berpadu dengan kecerdikan."</Text>

          <CustomButton title="Contionue with Email" handlePress={() => router.push("/sign-in")} containerStyles="w-full mt-7" />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
