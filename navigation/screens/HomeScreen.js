import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { Audio } from "expo-av";
import React, {useState} from 'react';

export default function HomeScreen({navigation}) {

    const sound = new Audio.Sound()
    const [channels, setChannels] = useState([])
    const [schedule, setSchedule] = useState([])
    const [live, setLive] = useState("")
    let musiclibrary = []

    const fetchList2 = async () => {
        try {
            let response = await fetch("http://api.sr.se/api/v2/channels?format=json");
            let json = await response.json();
            setChannels(json.channels)
            return json;
        } catch (error) {
            console.error(error);
        }
    }

    const fetchSchedule = async () => {
        try {
          const response = await fetch("http://api.sr.se/v2/scheduledepisodes?channelid=132&format=json&pagination=false");
          let json = await response.json();
          setSchedule(json.schedule)
          const now = Date.now()
          
          schedule.forEach(element => {
      
            let startTime = element.starttimeutc
            startTime = startTime.slice(6, -2)
            let endTime = element.endtimeutc
            endTime = endTime.slice(6, -2)
      
            if(startTime < now && endTime > now){
              console.log(element.title)
              setLive(element.title)
            } else {
              //console.log("NOPE")
            }
      
          });
        } catch (error) {
          console.error(error);
        }
      }

    async function loadSound(uri) {
        await sound.loadAsync({
            uri: uri
        })
    }

    async function playSound() {
        await sound.playAsync()
    }

    async function pause() {
        await sound.pauseAsync()
    }

    return (
        <View style={styles.container}>

        <Text>Open up App.js to start working on your app!</Text>
        <Button title='Fetch list' onPress={fetchList2}></Button>
        <Button title='Fetch live' onPress={fetchSchedule}></Button>
        <Text>{live}</Text>
        <FlatList
            data={channels}
            renderItem={({ item }) => (
                <Text style={styles.item}>{item.name}</Text>
            )}
        />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
    item: {
      marginTop: 24,
      padding: 30,
      backgroundColor: "pink",
    }
  });