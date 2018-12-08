import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator, View, Text} from 'react-native';

import { Geolocation } from "react-native-amap-geolocation";
import {MapView} from 'react-native-amap3d';
import MenuList from "./MenuList";

//Map View to display
export class RouteView extends Component{

    /*
     * constructor
     * initial: the flag which try to determine whether the map is loading
     * begin_loc: the location at the beginning time (for loading)
     * traffic: traffic info
     * location: the real-time location
     */
    constructor(props) {
        super(props);
        this.state = {initial:0, begin_loc:null, traffic:false, marker:null, marker_state:0};
        this.location = null;
    }

    // start geo-location module
    async componentDidMount() {
        await Geolocation.init({
            android: "ea2ff61e4ad654dd380b5adfa5e47fc6"
        });

        // set options
        Geolocation.setOptions({
            interval: 8000,
            distanceFilter: 10
        });

        // register listener
        this.listener = Geolocation.addLocationListener(location => {
            this.location = location;
            if (this.state.initial === 0) {
                this.setState({initial: 1, begin_loc: location});
                this._map.animateTo({coordinate:{latitude: this.state.begin_loc.latitude, longitude: this.state.begin_loc.longitude}},0);
            }
        });

        // start
        Geolocation.start()
    }

    // stop geo-location module and remove the listener
    componentWillUnmount() {
        Geolocation.stop();
        this.listener.remove()
    }

    // this function is used to invoke animateTo in MapView (for parent components)
    move = (coordinate, latency) =>{
        console.log(coordinate);
        this._map.animateTo(coordinate,latency)
    };

    touchToClose = () => {
        this.setState({'marker_state':0})
        let func = this.props.closeCard;
        func&&func();
    }

    touchToOpen = () => {
        this.setState({'marker_state':1})
        let func = this.props.openCard;
        func&&func();
    }


    render() {

        //reset the location style
        let locationStyle = {
            image: 'ic_location_arrow',
            fillColor: '#00000000',
            strokeColor: '#00000000',
        };


        //if the initial state is zero, then waiting and loading
        if(this.state.initial === 0)
            return (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size= 'small' color= 'red'/>
                </View>);
        else {
            return (
                <MapView
                    ref = {(_ref) => {this._map=_ref}}
                    style={styles.map}
                    locationEnabled
                    locationStyle={locationStyle}
                    showsLocationButton
                    showsTraffic={this.state.traffic}
                    showsBuildings
                    onLocation={({nativeEvent}) =>
                        console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)}
                    onPress = {()=>{this.touchToClose()}}
                    //coordinate={{latitude: this.state.begin_loc.latitude, longitude: this.state.begin_loc.longitude}}
                >
                    {this.state.marker?<MapView.Marker title='marker' coordinate={{
                        latitude: this.state.marker.latitude,
                        longitude: this.state.marker.longitude
                    }} opacity={this.state.marker_state} infoWindowDisabled={true} onPress={this.touchToOpen}/>:null}
                </MapView>
            )
        }
    }
}


const styles = StyleSheet.create({
    map: {
        flex:1
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
});