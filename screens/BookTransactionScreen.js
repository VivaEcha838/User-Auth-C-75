import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, ToastAndroid, Alert} from 'react-native';
import * as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-barcode-scanner'
import firebase from 'firebase'
import db from '../config'


export default class BookTransactionScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            hasCameraPermissions: null,
            scanned: false,
            scannedBookID: '',
            scannedStudentID: '',
            buttonState: 'normal',
            transactionMessage : ''
        }
    }
    getCameraPermissions=async(ID)=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermissions: status==="granted",
            buttonState: ID,
            scanned: false
        })
    }
    handleBarCodeScanned= async({type,data})=>{
        const {buttonState} = this.state.buttonState
        if(buttonState==="BookID"){
            this.setState({
                scanned: true,
                scannedBookID: data,
                buttonState: 'normal',
            })
        }else if(buttonState==="StudentID"){
            this.setState({
                scanned: true,
                scannedStudentID: data,
                buttonState: 'normal',
            })
        }
       
    }
    handleTransaction= async ()=>{
        //b.collection(collectionName).doc(documentID).get().then()
        var transactionType = await this.checkBookEligibility()
        console.log(transactionType)
        if(! transactionType){
            Alert.alert("The book does not exist in the library")
            console.log("The book does not exist in the library")

            this.setState({
                scannedBookID: '',
                scannedStudentID: ''
            })
        }else if(transactionType === 'Issue'){
            var isStudentEligible = await this.checkStudentEligibilityForBookIssue()
            if(isStudentEligible){
                this.initiateBookIssue();
                Alert.alert("Book Issued to the Student")
                console.log("Book Issued to the Student")
            }
        }else{
            var isStudentEligible = await this.checkStudentEligibilityForBookReturn()
            if(isStudentEligible){
                this.initiateBookReturn()
                Alert.alert("Book Returned from Student")
                console.log("Book Returned from Student")
            }
        }
    }
    checkStudentEligibilityForBookIssue= async ()=>{
        const studentRef = await db.collection("Students").where('studentID', "==", this.state.scannedStudentID).get()
        var isStudentEligible = ''
        if(studentRef.docs.length == 0){
            this.setState({
                scannedBookID: '',
                scannedStudentID: ''
            })
            isStudentEligible = false
            Alert.alert("The StudentID does not exist in the database")
            console.log("The StudentID does not exist in the database")
        }else {
            studentRef.docs.map((doc)=>{
                var student = doc.data()
                if(student.numberOfBooksIssued < 2){
                    isStudentEligible = true
                    
                }else{
                    isStudentEligible = false
                    Alert.alert("This student has already issued 2 books!")
                    console.log("This student has already issued 2 books!")

                    this.setState = ({
                        scannedBookID: '',
                        scannedStudentID: ''
                    })
                }
            })

        }
        return isStudentEligible
    }
    checkStudentEligibilityForBookReturn= async ()=>{
        const transactionRef = await db.collection("Transactions").where('bookID', '==', this.state.scannedBookID).limit(1).get()
        var isStudentEligible = ''
        transactionRef.docs.map((doc)=>{
            var lastBookTransaction = doc.data()
            if(lastBookTransaction.studentID === this.state.scannedStudentID){
                isStudentEligible = true
            }else{
                isStudentEligible = false
                Alert.alert("This book was not issued to the student")
                console.log("This book was not issued to the student")

                this.setState = ({
                    scannedBookID: '',
                    scannedStudentID: ''
                })
            }


        })
        return isStudentEligible
    }
    checkBookEligibility= async ()=>{
        const bookRef = await db.collection("Books").where('bookID', '==', this.state.scannedBookID).get()
        var transactionType = ''
        if(bookRef.docs.length == 0){
            transactionType = false
            console.log(transactionType)

        }else {
            bookRef.docs.map((doc)=>{
                var book = doc.data()
                if(book.bookAvailability){
                    transactionType = "Issue"
                    console.log(transactionType)
                }else {
                    transactionType = "Return"
                    console.log(transactionType)

                }
            })
        }
          return transactionType
    }

    initiateBookIssue= async ()=>{
        db.collection("Transactions").add({
            studentID: this.state.scannedStudentID,
            bookID: this.state.scannedBookID,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactionType: "Issue"
    })
    db.collection("Books").doc(this.state.scannedBookID).update({
        bookAvailability: false,
    })
    db.collection("Students").doc(this.state.scannedStudentID).update({
        numberOfBooksIssued: firebase.firestore.FieldValue.increment(1)
    })
    Alert.alert("Book Issued")
    this.setState({
        scannedBookID: '',
        scannedStudentID: '',
    })
}

initiateBookReturn= async ()=>{
    db.collection("Transactions").add({
        studentID: this.state.scannedStudentID,
        bookID: this.state.scannedBookID,
        date: firebase.firestore.Timestamp.now().toDate(),
        transactionType: "Return"
})
db.collection("Books").doc(this.state.scannedBookID).update({
    bookAvailability: true,
})
db.collection("Students").doc(this.state.scannedStudentID).update({
    numberOfBooksIssued: firebase.firestore.FieldValue.increment(-1)
})
Alert.alert("Book Returned")
this.setState({
    scannedBookID: '',
    scannedStudentID: '',
})
}
    render(){
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;
        if(buttonState!=='normal ' && hasCameraPermissions){
           return(
               <BarCodeScanner
               onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScanned}
               style={StyleSheet.absoluteFillObject}
               />
           )
        }else if(buttonState==='normal'){
            return(
                <KeyboardAvoidingView style={styles.container}
                behavior = 'padding'
                enabled>
                    <View>
                        <Image
                        style={{width: 200, height: 200}}
                        source={require("../assets/booklogo.jpg")}
                        />
                        <Text style={{textAlign: 'center', fontSize: 40}}> 
                            WILY
                        </Text>
                    </View>
                    <View style={styles.inputView}>
                    <TextInput
                    style = {styles.inputBox}
                    placeholder = "Enter Book ID"
                   
                    onChangeText = {text=>{
                        this.setState({
                            scannedBookID: text
                        })
                    }}
                    value = {this.state.scannedBookID}
                    />
                    <TouchableOpacity style={styles.scanButton}
                     onPress = {()=>{this.getCameraPermissions("BookID")}}
                    >
                      <Text style={styles.displayText}>
                          Scan
                      </Text>
                    </TouchableOpacity>
                    </View>

                    <View style={styles.inputView}> 
                    <TextInput
                    style = {styles.inputBox}
                    placeholder = "Enter Student ID"
                    onChangeText = {text=>{
                        this.setState({
                            scannedStudentID: text
                        })
                    }}
                    value = {this.state.scannedStudentID}
                    />
                    <TouchableOpacity style={styles.scanButton}
                     onPress = {()=>{this.getCameraPermissions("StudentID")}}
                    >
                    
                      <Text style={styles.displayText}>
                          Scan
                      </Text>
                    </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.scanning}
                     onPress={async()=>{
                         console.log(this.state.scannedBookID)
                         console.log(this.state.scannedStudentID)

                         this.handleTransaction()
                     }}
                    >
                        <Text style={styles.displayText}>
                            Submit
                        </Text>
                    </TouchableOpacity>

                    </KeyboardAvoidingView>
                    
                
            )
        }
        
    }
}
const styles = StyleSheet.create({
    scanning: {
        width: 200,
        height: 50,
        margin: 10,
        borderRadius: 15,
        backgroundColor: 'gold',
        alignItems: 'center',
        justifyContent: 'center'
    },
    displayText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    inputView: {
        flexDirection: "row",
        margin: 20,
    },
    inputBox: {
       width: 200,
       height: 40,
       borderWidth: 1.5,
       fontSize: 20
    },
    scanButton: {
       backgroundColor: 'blue',
       width: 50,
       borderWidth: 1.5
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})