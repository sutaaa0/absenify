import { View, Text, Image } from "react-native";

const CardIzin = ({
  izin: {
    waktuIzin,
    Status,
    Keterangan,
    userIzin: {
      username, avatar
    }
  },
}) => {
console.log(waktuIzin)
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
          <Text className="text-gray-700 font-psemibold bg-green-500 p-[2px] rounded-lg text-xs">{Keterangan}</Text>
          <Text className={`text-gray-700 font-psemibold ${Status === "Izin" ? "text-yellow-500" : "text-red"} p-[2px] rounded-lg text-xs`}>{Status}</Text>
          <Text className="text-xs font-pregular text-gray-500">{waktuIzin}</Text>
        </View>
      </View>
    </View>
  );
};

export default CardIzin;
