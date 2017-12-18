/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CodePush from "react-native-code-push";


export default class App extends Component<{}> {

  constructor() {
    super();
    this.state = { restartAllowed: true };
  }

  codePushStatusDidChange(syncStatus) {
    console.log("syncStatus000",syncStatus);
    switch(syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({ syncMessage: "Checking for update." });
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ syncMessage: "Downloading package." });
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({ syncMessage: "Awaiting user action." });
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ syncMessage: "Installing update." });
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({ syncMessage: "App up to date.", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({ syncMessage: "Update cancelled by user.", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({ syncMessage: "Update installed and will be applied on restart.", progress: false });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({ syncMessage: "An unknown error occurred.", progress: false });
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({ progress });
  }

  /** Update is downloaded silently, and applied on restart (recommended) */
  sync() {
    console.log("sync");
    CodePush.sync(
      {},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

   /** Update pops a confirmation dialog, and then immediately reboots the app */
  syncImmediate() {
    CodePush.sync(
      //{ installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true },
      {updateDialog: {
                        optionalIgnoreButtonLabel: '稍后',
                        optionalInstallButtonLabel: '更新',
                        optionalUpdateMessage: '有新版本了，是否更新？',
                        title: '更新提示',
                        appendReleaseDescription:true
                    },
                    installMode: CodePush.InstallMode.IMMEDIATE},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  toggleAllowRestart() {
    this.state.restartAllowed
      ? CodePush.disallowRestart()
      : CodePush.allowRestart();

    this.setState({ restartAllowed: !this.state.restartAllowed });
  }

  getUpdateMetadata() {
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
      .then((metadata: LocalPackage) => {
        this.setState({ syncMessage: metadata ? JSON.stringify(metadata) : "Running binary version", progress: false });
      }, (error: any) => {
        this.setState({ syncMessage: "Error: " + error, progress: false });
      });
  }

  checkForupdata(){
    CodePush.checkForUpdate()
    .then( (update) =>{
        if( !update ){
            console.log("app是最新版了");
        }else {
            console.log("有更新哦");
        }
    });
  }
  getUpdataInfo(){
    CodePush.getCurrenPackage()
    .then( (info) =>{
        console.log(info);
    })
  }
  render() {
    let progressView;

    if (this.state.progress) {
      progressView = (
        <Text style={styles.messages}>{this.state.progress.receivedBytes} of {this.state.progress.totalBytes} bytes received</Text>
      );
    }

    return (
      <View style={styles.container}>
        
        <TouchableOpacity onPress={this.checkForupdata.bind(this)}>
          <Text style={styles.syncButton}>Press for checkForupdata</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.sync.bind(this)}>
          <Text style={styles.syncButton}>Press for background sync</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.syncImmediate.bind(this)}>
          <Text style={styles.syncButton}>Press for dialog-driven sync</Text>
        </TouchableOpacity>
        {progressView}
        
        <TouchableOpacity onPress={this.toggleAllowRestart.bind(this)}>
          <Text style={styles.restartToggleButton}>Restart { this.state.restartAllowed ? "allowed" : "forbidden"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.getUpdateMetadata.bind(this)}>
          <Text style={styles.syncButton}>Press for Update Metadata</Text>
        </TouchableOpacity>
        <Text style={styles.messages}>{this.state.syncMessage || ""}</Text>
      </View>
    );
  }

  componentDidMount(){
    /*在加载完了可以允许重启*/
    //CodePush.allowRestart();

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
   messages: {
    marginTop: 30,
    textAlign: "center",
  },
  restartToggleButton: {
    color: "blue",
    fontSize: 17
  },
  syncButton: {
    color: "green",
    fontSize: 17
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 20
  },
});

let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };

App = CodePush(codePushOptions)(App);
