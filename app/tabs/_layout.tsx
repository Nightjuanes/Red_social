import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { DataProvider } from '@/context/datacontext/DataContext';

export default function _layout() {
    return (
        <DataProvider>
        
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "blue",
                headerShown: false
            }}
        >
            <Tabs.Screen
                name='home'
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ color }) => (<FontAwesome5 name="home" size={24} color={color} />)
                }}
            />
            <Tabs.Screen
                name='newPost'
                options={{
                    title: "Nuevo Post",
                    tabBarIcon: ({ color }) => (<FontAwesome5 name="plus-square" size={24} color={color} />)
                }}
            />
            <Tabs.Screen
                name='reels'
                options={{
                    title: "Reels",
                    tabBarIcon: ({ color }) => (<FontAwesome5 name="video" size={24} color={color} />) // Cambié el ícono aquí
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color }) => (<FontAwesome5 name="user" size={24} color={color} />)
                }}
            />
        </Tabs>
        </DataProvider>
    );
}

