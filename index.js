import {AppRegistry, Text, View, Animated, Image, TouchableOpacity, Dimensions, StyleSheet, PanResponder} from 'react-native';
import React from 'react';
import Sound from 'react-native-sound'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const margin = 10;
const gridCountHori = 30;
const gridCountVertical = 50;
const gridSize = (windowWidth - margin * 2) / gridCountHori;
const gridStartX = margin;
const gridStartY = margin;

var musicPath = require('./resources/14226.mp3')
var musicPlayer = new Sound(musicPath, (error) => {})

musicPath = require('./resources/welcome.mp3')
var welcomePlayer = new Sound(musicPath, (error) => {})

musicPath = require('./resources/gamestart.mp3')
var gamestartPlayer = new Sound(musicPath, (error) => {})

musicPath = require('./resources/click.mp3')
var clickPlayer = new Sound(musicPath, (error) => {})

musicPath = require('./resources/gameover.mp3')
var gameoverPlayer = new Sound(musicPath, (error) => {})

musicPath = require('./resources/eat.mp3')
var eatPlayer = new Sound(musicPath, (error) => {})

musicPath = require('./resources/speedchange.mp3')
var speedPlayer = new Sound(musicPath, (error) => {})

export default class App extends React.Component {

  _handleStartShouldSetPanResponder = (
    event,
    gestureState,
  ) => {
    // Should we become active when the user presses down on the circle?
    return true;
  };

  _handleMoveShouldSetPanResponder = (
    event,
    gestureState,
  ) => {
    // Should we become active when the user moves a touch over the circle?
    return true;
  };

  _handlePanResponderGrant = (
    event,
    gestureState,
  ) => {
    console.log('_handlePanResponderGrant');
  };

  _handlePanResponderMove = (event, gestureState) => {
    console.log('_handlePanResponderMove');

    let dx = Math.abs(gestureState.dx);
    let dy = Math.abs(gestureState.dy);

    if(dx > dy) {
      if (dx > 50) {
          if (gestureState.dx < 0) {
            this.onPressDirection(3); 
          } else {
            this.onPressDirection(1); 
          }
      }
    } else {
      if (dy > 50) {
        if (gestureState.dy < 0) {
          this.onPressDirection(0); 
        } else {
          this.onPressDirection(2); 
        }
      }
    }
  };


  _handlePanResponderEnd = (event, gestureState) => {
    console.log('_handlePanResponderEnd');
  };

  _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
    onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
    onPanResponderGrant: this._handlePanResponderGrant,
    onPanResponderMove: this._handlePanResponderMove,
    onPanResponderRelease: this._handlePanResponderEnd,
    onPanResponderTerminate: this._handlePanResponderEnd,
  });

  constructor(props) {
    super(props);
    this.state = {
      moveSpeed: 500,
      score: 0,
      started: false,
      gameOver: false,
      direction: 40001,
      food: {row: 40, column: 25},
      data: {head: {row: 10, column: 10}, cornerPoints: [{row: 10, column: 7}, {row: 15, column: 7}], count: 9}
    };

  }

  getBodyItemsPositon() {
    var result = [];
    var cur = this.state.data.head;
    result.push({...cur});
    for (var j = 0; j < this.state.data.cornerPoints.length; j++) {
      var next = this.state.data.cornerPoints[j];
      if (cur.row == next.row) {
        if (cur.column > next.column) { //左
          for (var i = cur.column - 1; i >= next.column; i--) {
            if (result.length < this.state.data.count) {
              result.push({row: cur.row, column: i});
            }
          }
        } else { //右
          for (var i = cur.column + 1; i <= next.column; i++) {
            if (result.length < this.state.data.count) {
              result.push({row: cur.row, column: i});
            }
          }
        }
      } else if (cur.column == next.column) {
        if (cur.row > next.row) { //上
          for (var i = cur.row - 1; i >= next.row; i--) {
            if (result.length < this.state.data.count) {
              result.push({row: i, column: cur.column});
            }
          }
        } else { //下
          for (var i = cur.row + 1; i <= next.row; i++) {
            if (result.length < this.state.data.count) {
              result.push({row: i, column: cur.column});
            }
          }
        }
      }
      cur = {...next};
    }
    return result;
  }

  getBodyItemView(row, column) {
    return (
      <View
        key={'' + row + column}
        style={{
        position: 'absolute',
        left: gridStartX + column * gridSize,
        top: gridStartY + row * gridSize,
        width: gridSize,
        height: gridSize,
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor: 'black'
        }}>
      </View>
    );
  }

  getGameOverBodyItemView(row, column) {
    return (
      <View
        key={'' + row + column}
        style={{
        position: 'absolute',
        left: gridStartX + column * gridSize,
        top: gridStartY + row * gridSize,
        width: gridSize,
        height: gridSize,
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor: 'red'
        }}>
      </View>
    );
  }

  getControlView() {
    return (
      <View
        style={{
        position: 'absolute',
        left: (windowWidth - 210) / 2,
        bottom: 0,
        width: 210,
        height: 140,
        flexDirection: 'row',
        flexWrap: 'wrap',
        }}>
        <View
          style={{
          width: 70,
          height: 70,
          }}>
        </View>
        <TouchableOpacity
          onPress={() => { this.onPressDirection(0); }}
        >
        <View
          style={styles.control}>
        </View>
        </TouchableOpacity>
        <View
          style={{
          width: 70,
          height: 70,
          }}>
        </View>

        <TouchableOpacity
          onPress={() => { this.onPressDirection(3); }}
        >
        <View
          style={
            styles.control
          }>
        </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { this.onPressDirection(2); }}
        >
        <View
          style={styles.control}>
        </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { this.onPressDirection(1); }}
        >
        <View
          style={styles.control}>
        </View>
        </TouchableOpacity>

      </View>
    );
  }

  getScoreView() {
    return <View style = {styles.score}>
      <Text style = {{color:'red'}}>分数:{this.state.score}</Text>
    </View>
  }

  musicSound(s) {

    switch (s) {
      // 开场音乐
      case 0:
      welcomePlayer.play();
      break;
      // 点击声音
      case 1:
      clickPlayer.play();
      break;
      // 吃食物
      case 2:
      eatPlayer.play();
      break;
      // 开始
      case 3:
      gamestartPlayer.play();
      break;
      // 速度变化
      case 3:
      speedPlayer.play();
      break;
      // 结束
      case 6:
      gameoverPlayer.play()
      break;
    }

  }

  render() {
    if (!this.state.started) {
      return (
        <View
          style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: '#f5f5f5'
          }}
          >
          <Image source={require('./resources/start.png')} style = {styles.backgroundImage}></Image>
          <TouchableOpacity
            onPress={() => {this.onPress(); }}
          >
            <Text style={{color: 'green', fontSize: 40, fontWeight: '800'}}>开始</Text>
            { this.getScoreView() }
          </TouchableOpacity>
        </View>
      );
    }

    //绘制snack
    var items = this.getBodyItemsPositon();

    // 游戏结束
    if (this.state.gameOver) {
      this.musicSound(6)
      let snackView = items.map((data) => {
        return this.getGameOverBodyItemView(data.row, data.column);
      });
      return (
        <View
          style={styles.game}>
          <View style={{borderWidth: 5, borderColor: 'black', position: 'absolute', left: margin - 3, top: margin - 3, width: windowWidth - margin * 2 + 6, height: gridCountVertical * gridSize + 6}}/>
            { snackView }
            { this.getScoreView() }
        </View>
      );
    }

    let snackView = items.map((data) => {
      return this.getBodyItemView(data.row, data.column);
    });
    return (
      <View
        style={styles.game}>
        <View style={
          {borderWidth: 5, borderColor: 'black', 
          position: 'absolute', left: margin - 3, top: margin - 3,
          width: windowWidth - margin * 2 + 6, height: gridCountVertical * gridSize + 6}}
          {...this._panResponder.panHandlers}/>
        { snackView }
        { this.getBodyItemView(this.state.food.row, this.state.food.column) }
        { this.getControlView() }
        { this.getScoreView() }
      </View>
    );
  }

  onPress() {
    this.state.score = 0
    this.state.gameOver = false
    this.musicSound(3)
    this.setState({started: true});
    this.gameStart();
  }

  onPressDirection(d) {
    this.musicSound(1)
    if ((this.state.direction + 1) % 4 == d) {
      this.setState({direction: this.state.direction + 1});
    } else if ((this.state.direction - 1) % 4 == d) {
      this.setState({direction: this.state.direction - 1});
    }
  }

  next() { //snack前进，并判断吃食物或者死亡
    var resultData = JSON.parse(JSON.stringify(this.state.data));
    var curHead = {...this.state.data.head};
    var firstCorner = this.state.data.cornerPoints[0];
    var nextPos = {row: curHead.row - 1, column: curHead.column};
    if (this.state.direction % 4 == 1) {
      nextPos = {row: curHead.row, column: curHead.column + 1};
    } else if (this.state.direction % 4 == 2) {
      nextPos = {row: curHead.row + 1, column: curHead.column};
    } else if (this.state.direction % 4 == 3) {
      nextPos = {row: curHead.row, column: curHead.column - 1};
    }
    if ((curHead.row == firstCorner.row && firstCorner.row == nextPos.row) || (curHead.column == firstCorner.column && firstCorner.column == nextPos.column)) { //仅更新头位置
      resultData.head = nextPos;
    } else { //拐弯
      resultData.head = nextPos;
      resultData.cornerPoints.unshift(curHead);
    }
    if (nextPos.row == this.state.food.row && nextPos.column == this.state.food.column) { //吃食物
      this.musicSound(2);
      this.state.score++;
      if (this.state.score % 5 == 0) {
        this.musicSound(3);
        this.speedUp()
      }
      resultData.count = resultData.count + 1;
      var randomRow = Math.floor(Math.random() * gridCountVertical);
      var randomColumn = Math.floor(Math.random() * gridCountHori);
      this.setState({food: {row: randomRow, column: randomColumn}});
    }
    if (nextPos.row < 0 || nextPos.row >= gridCountVertical || nextPos.column < 0 || nextPos.column >= gridCountHori) { //死1
      this.gameOver();
      return;
    }
    if (this.getBodyItemsPositon().findIndex((e) => e.row == nextPos.row && e.column == nextPos.column) != -1) { //死2
      this.gameOver();
      return;
    }
    this.setState({data: resultData});
  }

  // 游戏结束
  gameOver() {
    clearInterval(this.timer);
    this.setState({gameOver: true});
    setTimeout(()=> {
      this.setState({started: false});
    }, 3000)
    
  }

  // 游戏开始
  gameStart() {
    let data = {head: {row: 10, column: 10}, cornerPoints: [{row: 10, column: 7}, {row: 15, column: 7}], count: 9}
    this.state.data = data
    this.timer = setInterval(() => {
      this.next();
    }, this.state.moveSpeed);
  }

  // 游戏加速
  speedUp() {
    this.state.moveSpeed -= 100;
    if(this.state.moveSpeed == 0) {
      this.state.moveSpeed = 500;
    }
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.next();
    }, this.state.moveSpeed);
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.musicSound(0);
  }
}



const styles = StyleSheet.create({
  control: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: 'black'
  },

  score: {
    width: 100,
    height: 30,
    borderWidth: 1,
    borderColor: "red",
    alignItems: 'center',
    justifyContent: "center"
  },

  game: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'grey'
  },

  backgroundImage:{
    width:100,
    height: 100,
    //背景图像的缩放类型: 包含(contain),拉伸(stretch)
    resizeMode:'center'
  },


});

AppRegistry.registerComponent('rn61', () => App);
