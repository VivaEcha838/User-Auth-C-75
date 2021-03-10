import * as React from 'react';
import { View, Text, TextInput, Image, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';



export default class AuthScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            emailID: '',
            passWord: ''
        }
    }
    userLogin =async (email, password)=>{
      if(email && password){
        try{
          const response = await firebase.auth().signInWithEmailAndPassword(email, password)
          if(response){
              this.props.navigation.navigate('Transaction')
          }
        }catch(error){
        switch(error.code){
            case 'auth/user-not-found':
             Alert.alert('User does not exist')
             console.log('User does not exist')
             break;

             case 'auth/invalid-email':
                 Alert.alert('Incorrect email or password')
                 console.log('Incorrect email or password')
        }
        }
      }else {
          console.log('Enter Email and Password')
          Alert.alert('Enter Email and Password')
      }
    }
    render(){
        return(
            <KeyboardAvoidingView style={{alignItems: 'center', marginTop: 20}}>
                <View>
                    <Image
                    source = {require("../assets/booklogo.jpg")}
                    style={{width: 200, height: 200}}
                    />
                    <Text style={{textAlign: 'center', fontSize: 45, color: 'gold'}}>
                      WILY
                    </Text>

                </View>
                <View style={{marginTop: 80}}>
                    <TextInput
                    style={styles.textInput}
                      placeholder = "xyz@example.com"
                      keyboardType = 'email-address'
                      onChangeText = {(text)=>{
                          this.setState({
                              emailID: text
                          })
                      }}
                    />
                    <TextInput
                    style={styles.textInput}
                      placeholder = 'Enter password'
                      secureTextEntry = {true}
                      onChangeText = {(text)=>{
                          this.setState({
                              passWord: text
                          })
                      }}
                    />

                </View>
                <View>
                    <TouchableOpacity
                    style={styles.loginButton}
                    onPress = {()=>{
                        this.userLogin(this.state.emailID, this.state.passWord);
                    }}
                    >
                        <Text style={{textAlign: 'center', fontSize: 25, fontFamily: 'fantasy', fontWeight: 'bold', color: 'yellow'}}>
                          Login!
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
const styles = StyleSheet.create({
    textInput: {
        width: 200,
        height: 40,
        borderWidth: 1,
        fontSize: 25,
        margin: 5
      },
      loginButton: {
         width: 120,
         height: 60,
         borderRadius: 5,
         borderWidth: 1,
         backgroundColor: 'green',
         marginTop: 20,
         justifyContent: 'center',
         alignItems: 'center'

      }
})
    
