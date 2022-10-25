import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Pressable } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import CommonDataManager from './CommonDataManager';
import SoundHandler from './SoundHandler';
import { PressableScale } from 'react-native-pressable-scale';

export default Card = (props) => {

  const [schedule, setSchedule] = useState([])
  const [live, setLive] = useState({})
  const soundManager = new SoundHandler()

  useEffect(() => {
    // if (live != "") return
    fetchSchedule(props.item.id)
    // console.log("live called")
}, [live])

useEffect(() => {
  getLive()
  // console.log("schedule loaded for " + props.item.name)
  // console.log("image url " + image )
}, [schedule])


const isFavorited = () => {
  let dataManager =  CommonDataManager.getInstance()
  let ids = dataManager.getFavIDs()
  if(ids.includes(props.item.id)) {
    return "favorite"
  } else {
    return "favorite-outline"
  }
}


const fetchSchedule = async (id) => {
  const uri = `http://api.sr.se/v2/scheduledepisodes?channelid=${id}&format=json&pagination=false`

  try {
    const response = await fetch(uri);
    let json = await response.json();
    setSchedule(json.schedule)

  } catch (error) {
    console.error(error);
  }
}

const getLive = () => {
  const now = Date.now()
  schedule.forEach(element => {
    let startTime = element.starttimeutc
    startTime = startTime.slice(6, -2)
    let endTime = element.endtimeutc
    endTime = endTime.slice(6, -2)

    if(startTime < now && endTime > now){
      setLive(element)
    } else {
      //console.log("No Live Program") 
    }

  });
}


const isPlaying = () => {
  if (soundManager.channel.id == props.item.id && soundManager.isPlaying){
    return "pausecircle"
  } else {
    return "play"
  }
}

  return (
    <PressableScale onPress={() => props.onPress(schedule)}>
      <View style={styles.container}>
      <View style={[styles.cardContainer, {backgroundColor: '#'+props.item.color}]}>
        {/* <TouchableOpacity style ={styles.card} onPress={onPress}> */}
        <View style={styles.imgTextContainer}>
          <Image style={styles.cardImage} source={{ uri: props.item.image }} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.cardText} numberOfLines={1}>{props.item.name}</Text>
            <Text style={styles.programText} numberOfLines={1}>{live.title}</Text>
            <Image style={styles.programImage} source={{ uri: live.imageurl }} />
          </View>
        </View>
        <View style={styles.buttonContainer}>
        <PressableScale onPress={()=> props.playRadio(live)}>
          <AntDesign style={styles.play} name={isPlaying()} size={45} color="black" />
        </PressableScale>
        </View>
        <PressableScale onPress={()=>props.addFavorite()}>
          <MaterialIcons  name={isFavorited()} size={30} color="black" />
        </PressableScale>
      </View>
    </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: '#219ebc',
    marginBottom: 20,
    shadowColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    shadowOffset: {
      width: 3,
      height: 3
    }
  },
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  imgTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  card: {
    backgroundColor: '#50A0B7',
    marginBottom: 20,
    marginLeft: '2%',
    width: '96%',
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 9,
    shadowOffset: {
      width: 3,
      height: 3
    }
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    height: 100,
    width: 100,
    borderRadius: 12,
    padding: 15,
    margin: 5,
    resizeMode: 'cover'
  },
  programImage: {
    height: 50,
    width: 50,
    borderRadius: 5,
    padding: 3,
    margin: 5,
    resizeMode: 'cover'
  },
  cardText: {
    padding: 1,
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  programText: {
    fontSize: 12,
    fontWeight: '400'
  },
  play: {
    marginEnd: 10
  },
  infoTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1
  },
  
});