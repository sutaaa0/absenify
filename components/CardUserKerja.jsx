import { View, Text, Image } from "react-native";

const CardUserKerja = ({ Users: { username, avatar, Status, Keterangan, email, totalIzin } }) => {
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
          <Text className={`text-sm text-gray-100 text-center font-pregular ${Status === "Kerja" ? `text-green-500` : null || Status === "Izin" ? `text-yellow-500` : null || Status === "Sakit" ? `text-red-500` : null}`}>{Status}</Text>
          <Text className="text-xs font-pregular text-gray-500">{Keterangan}</Text>
          <View className="flex-row gap-x-2">
          <Text className="text-xs font-pregular text-gray-500">{email}</Text>
          <Text className="text-xs font-pregular text-gray-500">Totoal izin : {totalIzin ? totalIzin : "0"}</Text>

          </View>
        </View>
      </View>
    </View>
  );
};

export default CardUserKerja;
