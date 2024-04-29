import { View, Text, Image } from "react-native";

const CardAdmin = ({
  absensi: {
    waktuabsen,
    keterangan,
    userAbsen: { username, avatar, Status, Keterangan },
  },
}) => {
  return (
    <View className="flex-row items-center gap-x-1 justify-between my-2 mx-2">
      <View className="p-[3px]">
        <Image source={{ uri: avatar }} className="w-[55px] h-[55px] rounded-lg" resizeMode="cover" />
      </View>
      <View className="flex-1 flex-col gap-x-2  justify-center items-start">
        <View className="flex">
          <Text className="text-white font-psemibold">{username}</Text>
        </View>
        <View className="flex-col gap-y-1 text-gray-100 items-start justify-center">
          {keterangan === "Tepat waktu" ? (
            <Text className="text-gray-700 font-psemibold bg-green-500 p-[2px] rounded-lg text-xs">{keterangan}</Text>
          ) : (
            <Text className="text-gray-50 font-psemibold bg-red-500 p-[2px] rounded-lg text-xs">{keterangan}</Text>
          )}
          <Text className="text-xs font-pregular text-gray-500">{waktuabsen}</Text>
          <Text className={`text-sm text-gray-100 text-center font-pregular ${Status === "Kerja" ? `text-green-500` : null || Status === "Izin" ? `text-yellow-500` : null || Status === "Sakit" ? `text-red-500` : null}`}>{Status}</Text>
          <Text className="text-xs font-pregular text-gray-500">{Keterangan}</Text>
        </View>
      </View>
    </View>
  );
};

export default CardAdmin;
