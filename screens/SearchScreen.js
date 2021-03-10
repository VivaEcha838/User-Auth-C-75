import React from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import db from '../config';

export default class SearchScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            allTransactions: [],
            lastVisibleTransaction: null,
            search: ''
        }
    }

    componentDidMount=async()=>{
      const query = await db.collection('Transactions').limit(10).get()
      query.docs.map((doc)=>{
         this.setState({
             allTransactions: [],
             lastVisibleTransaction: doc,
         })
      })
    }
    searchTransactions= async(text)=>{
        var enteredText = text.split("")
        console.log(enteredText)
        if(enteredText[0].toUpperCase()==='B'){
          const transaction = await db.collection('Transactions').where('bookID','==',text).get();
          console.log(transaction.docs.length)
          transaction.docs.map((doc)=>{
              this.setState({
                  allTransactions: [...this.state.allTransactions, doc.data()],
                  lastVisibleTransaction: doc,
              })
          })
        }else if(enteredText[0].toUpperCase()==='S'){
            const transaction = await db.collection('Transactions').where('studentID','==',text).get();
            transaction.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc,
                  })
            })
        }
    }
    fetchMoreTransactions= async()=>{
        var text = this.state.search.toUpperCase()
        var enteredText = text.split("")
        if(enteredText[0].toUpperCase()==='B'){
          const transaction = await db.collection('Transactions').where('bookID','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
          transaction.docs.map((doc)=>{
              this.setState({
                  allTransactions: [...this.state.allTransactions, doc.data()],
                  lastVisibleTransaction: doc,
              })
          })
        }else if(enteredText[0].toUpperCase()==='S'){
            const transaction = await db.collection('Transactions').where('studentID','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
            transaction.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction: doc,
                  })
            })
        }
    }
    
    render(){
        return(
            <View style={styles.container}>
              <View style={styles.searchBar}>
               <TextInput style={styles.inputBox}
               placeholder = "Enter Book ID or Student ID"
                 onChangeText = {(text)=>{
                      this.setState({
                          search: text
                      })
                 }}
               >
                      
               </TextInput>
               <TouchableOpacity style={styles.searchButton}
               onPress = {()=>{
                this.searchTransactions(this.state.search);
               }}
               >
                 <Text>
                  Search
                 </Text>  
               </TouchableOpacity>
              </View>
              <FlatList
                  data = {this.state.allTransactions}
                  renderItem = {({item})=>(
                      <View style={{borderWidth: 2}}>
                          <Text>
                              {'Book ID: '+ item.bookID}
                          </Text>

                          <Text>
                              {'Student ID: '+ item.studentID}
                          </Text>

                          <Text>
                              {'Transaction Type: '+ item.transactionType}
                          </Text>

                          <Text>
                              {'Date: '+ item.date.toDate()}
                          </Text>
                      </View>
                  )}
                  keyExtractor = {(item,index)=>index.toString()}
                  onEndReached = {this.fetchMoreTransactions}
                  onEndReachedThreshold = {0.7}>
              </FlatList>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    searchBar: {
        flexDirection: 'row',
        height: 40,
        width: 'auto',
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: 'grey'
    },
    inputBox: {
        borderWidth: 2,
        height: 30,
        width: 300,
        marginLeft: 10,
    },
    searchButton: {
        borderWidth: 1,
        height: 30,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green'
    }
})