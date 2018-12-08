import React, {Component} from 'react';
import {StyleSheet, View, DrawerLayoutAndroid, Text, Button, TouchableHighlight} from 'react-native';
import {AMapView} from './AMapView'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MenuList from './MenuList'
import {Card} from 'antd-mobile-rn'

// loading icons
const MaterialHeaderButton = props => (
    <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color="black" />
);

// show the map screen
export class MapScreen extends Component{

    /*
     * constructor
     * drawerState: the flag is used for the get the current state of drawer
     * poi: save the poi information which returned by SearchScreen
     */
    constructor(props) {
        super(props);
        this.state = {poi_state:0};
        this.drawerState = false;
        this.poi = null;
    };


    // navigation header
    static navigationOptions = (({navigation}) => ({
        title: 'Travelling',
        headerLeft: (
            <HeaderButtons left HeaderButtonComponent={MaterialHeaderButton}>
                <Item
                    title="Menu"
                    iconName={'menu'}
                    onPress={navigation.getParam('touchDrawer')}
                />
            </HeaderButtons>
        ),
        headerRight: (
            <HeaderButtons right HeaderButtonComponent={MaterialHeaderButton}>
                <Item
                    title="Search"
                    iconName={'search'}
                    onPress={navigation.getParam('search')}
                />
            </HeaderButtons>
        ),
    }));

    // bind the button with the drawer function
    componentWillMount() {
        this.props.navigation.setParams({ touchDrawer: this._touchDrawer, search:this._search });
    }


    // when the component is reloaded, if the new poi is set, then set a marker and move to the place
    componentDidUpdate(){
        let new_poi = this.props.navigation.getParam('poi_info',null);

        console.log(new_poi);

        if(new_poi && this.state.poi_state === 1){
            let location = this.poi.location;
            let longitude = parseFloat(location.split(',')[0]);
            let latitude = parseFloat(location.split(',')[1]);

            this._map.setState({marker:{latitude:latitude,longitude:longitude}, marker_state:1});
            this._map.move({coordinate:{latitude: latitude, longitude: longitude}, zoomLevel:18},300);
        }
    }

    // this function is used to open and close the drawer
    _touchDrawer = () => {
        if(this.drawerState === false) {
            this.refs['drawer'].openDrawer()
        }
        else{
            this.refs['drawer'].closeDrawer()
        }
    };


    // this function is used to jump to the search screen and pass the position value
    _search = () => {
        let position = this._map.location;
        this.props.navigation.navigate('Search',{position:position})
    };


    // this function is used to bind the item in menu with their click functions
    _onMenuItem = (item) => {
        if(item === 1){
            this._map.setState({traffic:!this._map.state.traffic})
        }
    };

    _closeCard = () => {
        if(this.state.poi_state === 1)
            this.setState({poi_state:2});
    }

    _openCard = () => {
        if(this.state.poi_state === 2)
            this.setState({poi_state:1});
    }





    render() {
        let navigationView = () =>{
            return (
                <MenuList
                    onMenuItem={this._onMenuItem}
                />
            )
        };

        let poi_address = (poi) => {
            let pname = poi.pname
            let cname = (poi.cityname === pname)?"":poi.cityname
            let adname = poi.adname
            let pre_address = pname + cname + adname;
            return (
                <Text style={{ marginLeft: 16 }}>{pre_address + " " + poi.address}</Text>
            )
        }

        let poi_type = (poi) => {
            let type = poi.type
            let type_list = type.split(';')
            //return type.split(';')[-1]?type.split(';')[-1]:type;
            if(type_list.length === 0){
                return "";
            }
            else{
                return type_list[type_list.length - 1]?type_list[type_list.length - 1]:type;
            }

        }

        let new_poi = this.props.navigation.getParam('poi_info',null);
        if(new_poi && new_poi !== this.poi){
            this.poi = new_poi;
            this.state.poi_state = 1
        }


        return (
            <View style={StyleSheet.absoluteFill}>
                <DrawerLayoutAndroid
                    ref={'drawer'}
                    drawerWidth={230}
                    drawerPosition={DrawerLayoutAndroid.positions.Left}
                    renderNavigationView={navigationView}
                    drawerLockMode='locked-closed'
                    onDrawerOpen={()=>{this.drawerState = true}}
                    onDrawerClose={()=>{this.drawerState = false}}
                >
                    <AMapView
                        ref={(_ref) => {this._map=_ref}}
                        closeCard = {this._closeCard}
                        openCard = {this._openCard}
                    />
                    {this.state.poi_state === 1?
                    <Card full>
                        <Card.Header
                            title= {this.poi.name}
                            //extra={poi_type(this.poi)}
                        />
                        <Card.Body>
                            <View>
                                <Text style={{ marginLeft: 16, marginRight: 16,color:'black' }}>{poi_address(this.poi)}</Text>
                                <Text style={{ marginLeft: 16 }}>{poi_type(this.poi)}</Text>
                                <View style={{marginLeft:16, marginRight:16, justifyContent: 'flex-end'}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'flex-end',alignItems:'center'}}>
                                        <Button  title="查看路线" onPress={()=>{this.props.navigation.navigate('Route',{end_poi:this.poi, position:this._map.location})}}/>
                                    </View>
                                </View>
                            </View>
                        </Card.Body>
                    </Card>
                    :null}
                </DrawerLayoutAndroid>
            </View>
        )
    }

}
