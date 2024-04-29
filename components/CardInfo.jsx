import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CardInfo = ({ title, subtitle, containerStyles, titleStyles, subtitleStyles, handlePress }) => {
  return (
    <TouchableOpacity className={containerStyles} onPress={handlePress}>
      <Text className={`text-white text-center font-psemibold ${titleStyles} ${title === "Kerja" ? `text-green-500` : null || title === "Izin" ? `text-yellow-500` : null || title === "Sakit" ? `text-red-500` : null} `}>{title}</Text>
      <Text className={`text-sm text-gray-100 text-center font-pregular ${subtitleStyles}`}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
};

export default CardInfo;
