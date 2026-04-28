import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { COLORS } from "../../lib/constants";
import { useCartItemCount } from "../../features/cart/store";
import { useMessagingStore } from "../../features/messaging/store";

export default function TabLayout() {
  const cartCount = useCartItemCount();
  const unreadCount = useMessagingStore((s) => s.unreadCount);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          height: 88,
          paddingBottom: 24,
          paddingTop: 10,
          shadowColor: "rgba(0, 36, 68, 0.08)",
          shadowOpacity: 1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -8 },
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.5,
          fontFamily: "Inter_600SemiBold",
          marginTop: 2,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Catégories",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "view-grid" : "view-grid-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Panier",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <MaterialCommunityIcons
                name={focused ? "shopping" : "shopping-outline"}
                size={24}
                color={color}
              />
              {cartCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -8,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: COLORS.secondary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#fff",
                      fontFamily: "Inter_700Bold",
                    }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <MaterialCommunityIcons
                name={focused ? "chat" : "chat-outline"}
                size={24}
                color={color}
              />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -4,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: COLORS.secondary,
                    borderWidth: 2,
                    borderColor: "#ffffff",
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
