import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import BookTransactionScreen from './screens/BookTransactionScreen'
import SearchScreen from './screens/SearchScreen'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import AuthScreen from './screens/AuthScreen'


export default class App extends React.Component{
  render(){
    return(
      <AppContainer/>
    )
  }
}

const TabNavigator = createBottomTabNavigator({
  Transaction: {
    screen:BookTransactionScreen,
    navigationOptions: {
      tabBarIcon: <Image 
      style = {{width: 20, height: 20}}
      source = {require("./assets/book.png")}
      />,
      tabBarLabel: "Issue or Return the book"
    }
  },
  Search: {
    screen:SearchScreen,
    navigationOptions:{
      tabBarIcon: <Image 
      style = {{width: 20, height: 20}}
      source = {require("./assets/searchingbook.png")}
      />,
      tabBarLabel: "Search"
  }}
})
const SwitchNavigator = createSwitchNavigator({
  AuthScreen: {
    screen:AuthScreen,
  },
  TabNavigator: {
    screen: TabNavigator,
  }
})
const AppContainer = createAppContainer(SwitchNavigator);