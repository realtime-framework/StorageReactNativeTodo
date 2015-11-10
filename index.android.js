/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var module = require('RCTRealtimeCloudStorageAndroid');
var RCTRealtimeCloudStorage = new module();

RCTRealtimeCloudStorage.storageRef('2Ze1dz', 'token');
var tabref = RCTRealtimeCloudStorage.table("todoTable");
var messages = [];

var {
  AppRegistry,
  PixelRatio,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  ListView,
  TouchableHighlight,
} = React;

var RCTRealtimeStorageAndroid = React.createClass({

  getInitialState: function() {
    return {
      listName: "storage-demo",
      isLoading: false,
      active: 0,
      completed: 0,
      all: 1,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },

  getDataSource: function(messages: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(messages);
  },

  receiveData: function(receivedData){
    if (receivedData) {
      RCTRealtimeCloudStorage.RTLog("REALTIME", "on receivedData"+ (typeof (receivedData.timestamp)));
        messages[receivedData.timestamp] = receivedData;
      }else{
        RCTRealtimeCloudStorage.RTLog("REALTIME", "end receivedData");
        this.setState({
          dataSource: this.getDataSource(messages),
          isLoading: false
        });
      }
  },

  updateView: function(receivedData){
    messages[receivedData.timestamp] = receivedData;

    this.setState({
      dataSource: this.getDataSource([])
    });

    this.setState({
      dataSource: this.getDataSource(messages)
    });
  },

  removeData: function(removeData){
    delete messages[removeData.timestamp];

    this.setState({
      dataSource: this.getDataSource([])
    });

    this.setState({
      dataSource: this.getDataSource(messages)
    });
  },

  componentDidMount: function(){
  
    tabref.on("StorageEvent_UPDATE", this.updateView);

    tabref.on("StorageEvent_DELETE", this.removeData);
    
    tabref.equalsString("listName", this.state.listName);

    tabref.getItems(this.receiveData,
                   function(data){
                   console.log('error:' + JSON.stringify(data))
                   }
    );
  },


  onSearchChange: function(val){
    messages = [];
    this.setState({
      listName: val.nativeEvent.text,
    });

    tabref.equalsString("listName", val.nativeEvent.text);

    tabref.getItems(
      this.receiveData,
        function(data){
          console.log('error:' + JSON.stringify(data))
        }
      );
  },

  _renderRow: function(rowData: Object, sectionID: number, rowID: number) {
    JSON.stringify(rowData);
    return (
      <TodoItem 
        update={() => this.updateSate(rowData)} 
        item={rowData} 
        remove={() => this.deleteItem(rowData)}
      />
    );
  },
 
 newTodo: function(val){
    var timestamp = Math.floor(new Date()/1000);

    tabref.push({"listName": this.state.listName, "timestamp": timestamp, "task": val.nativeEvent.text, "state": 0}, function(success){

    }, function(error){
      console.log('not updated');
    });
  },

  updateSate: function(todo:Object){
    todo.state = (todo.state == 1) ? 0 : 1;
    tabref.push(todo, function(success){

    }, function(error){
      console.log('not updated');
    });
  },

  deleteItem: function(todo:Object){
    var itemR = tabref.itemCustom(todo.listName, todo.timestamp);
    itemR.del(function(){

    },
    function(){
      console.log("itemref error");
    });
  },

  resetTableRef: function(){
    tabref.off("StorageEvent_UPDATE");
    tabref.off("StorageEvent_DELETE");
    tabref = RCTRealtimeCloudStorage.table("todoTable");
    tabref.on("StorageEvent_UPDATE", this.updateView);
    tabref.on("StorageEvent_DELETE", this.removeData);

    messages = [];
    this.setState({
      dataSource: this.getDataSource([])
    });
  },

  filterAll: function(){
    this.setState(
      {
        isLoading: true,
        active: 0,
        completed: 0,
        all: 1
      });

    this.resetTableRef();    
    tabref.equalsString("listName", this.state.listName);
    RCTRealtimeCloudStorage.RTLog("REALTIME","GET ALL");
    tabref.getItems(this.receiveData,
                   function(data){
                   console.log('error:' + JSON.stringify(data))
                   }
    );
  },

  filterActive: function(){
    this.setState(
      {
        isLoading: true,
        active: 1,
        completed: 0,
        all: 0
      });

    this.resetTableRef();    
    tabref.equalsString("listName", this.state.listName);
    tabref.equalsNumber("state", 0);
    tabref.getItems(this.receiveData,
                   function(data){
                   console.log('error:' + JSON.stringify(data))
                   }
    );
    
  },

  filterCompleted: function(){
    this.setState(
      {
        isLoading: true,
        active: 0,
        completed: 1,
        all: 0
      });

    this.resetTableRef();    
    tabref.equalsString("listName", this.state.listName);
    tabref.equalsNumber("state", 1);
    tabref.getItems(this.receiveData,
                   function(data){
                   console.log('error:' + JSON.stringify(data))
                   }
    );
    
  },

  render: function() {
    return (
      <View style={styles.container}>
      
        <View style={styles.shadow}>
          <View style={styles.topBar}>
          </View>

          <View style={styles.sBar}>
            <SearchBar
              onSearchChange={this.onSearchChange}
              placeholder="storage-demo"
              isLoading={this.state.isLoading}
              onFocus={() => this.refs.listview.getScrollResponder().scrollTo(0, 0)}
            />

            <SearchBar
              onEndEditing={this.newTodo}
              placeholder="What needs to be done?"
              isLoading={this.state.isLoading}
              onFocus={() => this.refs.listview.getScrollResponder().scrollTo(0, 0)}
            />
          </View>

          <ListView
            ref="listview"
            style={styles.list}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
          />
          <View style={styles.line1}>
          </View>
          <View style={styles.line2}>
          </View>

          </View>
          <View style={[styles.middle, styles.shadow]}>
          </View>
          <View style={[styles.bottomView, styles.shadow]}>
            <CButton action={this.filterAll} text='All' selected={this.state.all} />
            <CButton action={this.filterActive} text='Active' selected={this.state.active}  />
            <CButton action={this.filterCompleted} text='Completed' selected={this.state.completed} />
          </View>
      </View>
    );
  }
});

var CButton = React.createClass({
  render: function() {
    if (this.props.selected){
    return (
      <View style={styles.searchBar}>
        <TouchableHighlight style={styles.bottomBt} onPress={this.props.action}>
          <Text style={styles.bottomBtSelected}>
            {this.props.text}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }else{
    return (
      <View style={styles.searchBar}>
        <TouchableHighlight style={styles.bottomBt} onPress={this.props.action}>
          <Text style={styles.bottomBtNot}>
            {this.props.text}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
  }
});

var SearchBar = React.createClass({
  render: function() {
    return (
      <View style={styles.searchBar}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onEndEditing={this.props.onEndEditing}
          onChange={this.props.onSearchChange}
          placeholder={this.props.placeholder}
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
        />
      </View>
    );
  }
});

var TodoItem = React.createClass({
  render: function() {
    var icon = (this.props.item.state == 1) ? { uri: 'check' } : { uri: 'notcheck' };
    return (
      <View>
          <View style={styles.row}>
            <TouchableHighlight onPress={this.props.update}>
                <Image source={icon} style={styles.icon}/>
            </TouchableHighlight>

            <View style={styles.textContainer}>
              <Text style={styles.movieTitle} numberOfLines={4}>
                {this.props.item.task}
              </Text>
            </View>
            
            <TouchableHighlight onPress={this.props.remove}>
                <Image source={{ uri: 'x' }} style={styles.icon} />      
            </TouchableHighlight>
          </View>
        <View style={styles.cellBorder} />
      </View>
    );
  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
    backgroundColor: '#F2F2F2',
    padding: 10,
    
  },
  line1:{
    position:'absolute',
    left: 33,
    top: 0,
    bottom: 0,
    backgroundColor: 'red',
    width: 1,
    opacity: 0.2,
  },
  line2:{
    position:'absolute',
    left: 36,
    top: 0,
    bottom: 0,
    backgroundColor: 'red',
    width: 1,
    opacity: 0.2,
  },
  topBar:{
    backgroundColor: '#B89470',
    height: 10,
  },
  sBar:{
    marginLeft: 40,
  },
  list:{
    flex: 1,
    backgroundColor: 'white',
  },
  middle:{
    marginLeft:5,
    marginRight: 5,
    borderTopWidth: 0,
    height: 5,
    borderColor:'black',
  },
  bottomView:{
    flexDirection: 'row',
    justifyContent:'center',
    marginLeft:15,
    marginRight: 15,
    borderTopWidth: 0,
  },
  bottomBt:{
    padding: 5,
    marginLeft:10,
    marginRight: 10,
  },
  bottomBtSelected:{
    color: '#33CCFF',
  },
  bottomBtNot:{
    color: '#83756f',
  },
  shadow:{
    shadowColor: 'black',
    shadowOffset: {height:5, width:3},
    shadowOpacity: 1,
  },
  centerText: {
    alignItems: 'center',
  },
  noMoviesText: {
    marginTop: 80,
    color: '#888888',
  },
  searchBar: {
    marginTop: 0,
    padding: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  remove:{
    color: '#a88a8a',
  },
  icon: {
    width: 20,
    height: 20,
  },
  searchBarInput: {
    fontSize: 15,
    flex: 1,
    height: 30,
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  spinner: {
    width: 30,
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  textContainer: {
    marginLeft:10,
    flex: 1,
  },
  movieTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '300',
    marginBottom: 2,
  },
  movieYear: {
    color: '#999999',
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
  },
  resizeMode: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: 85,
    height: 80,
    marginRight: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1,
  },
});

AppRegistry.registerComponent('RCTRealtimeStorageAndroid', () => RCTRealtimeStorageAndroid);
