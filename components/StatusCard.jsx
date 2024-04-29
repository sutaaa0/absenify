import { View, Text, FlatList } from "react-native";
import React from "react";
import useAppwrite from "../lib/useAppwrite";
import { getStatusUser } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
const { data: Status } = useAppwrite(() => getStatusUser(user.$id));



const StatusCard = () => {

  const StatusInfo = ({ status: { Status, Keterangan } }) => {
   <View>
    <Text>{Status}</Text>
   </View>
  };

  return (
    <View>
      <FlatList
        data={Status}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <StatusInfo status={item} />}
        ListHeaderComponent={() => <View className="w-full justify-center items-center mt-6 mb-12 px-4"></View>}
        ListEmptyComponent={() => <EmtyState title="tidak ada data absen" subtitle="segera lakukan absen" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default StatusCard;
