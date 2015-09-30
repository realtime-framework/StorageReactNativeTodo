## Realtime Cloud Storage Todo example for React Native (iOS/Android) 
This example uses the Realtime Cloud Storage React Native SDKs to save and retrieve todo lists from the cloud. This sample can be used with the other Realtime Todo samples, including the [on-line example](http://storage-public.realtime.co/samples/todo-lbl/index.html#/). 

Data will be synced in real-time between devices.

## About the Realtime Cloud Storage Service
Part of the [The Realtime® Framework](http://framework.realtime.co), the Realtime Cloud Storage Service is a highly-scalable backend-as-a-service powered by Amazon DynamoDB. We've added real-time notifications to keep data synchronized between users of your application.

## Storage table definition
This sample requires that a table named `todoTable` exists with the following key definition:

- Primary Key: listName (string)
- Secondary Key: timestamp (number)

## Security note
This samples uses a public unauthenticated demonstration key. If you want to keep your todo lists private, please get your free Realtime Cloud Storage application key [here](https://accounts.realtime.co/signup/) and change the key used in the sample. 
 
## Realtime Storage React Native SDK
This project doesn't bundle the Realtime Cloud Storage React Native SDKs, so you need to install them using npm.

###iOS
For the complete iOS SDK source, documentation and installation info, check the main repository at [https://github.com/realtime-framework/RCTRealtimeCloudStorageIOS](https://github.com/realtime-framework/RCTRealtimeCloudStorageIOS)

###Android
For the complete Android SDK source, documentation and installation info, check the main repository at [https://github.com/realtime-framework/RCTRealtimeStorageAndroid](https://github.com/realtime-framework/RCTRealtimeStorageAndroid)


####Note:
In iOS drag the images in the img folder to your project. 

In Android create `drawable-hdpi`,`drawable-mdpi`,`drawable-xhdpi` and `drawable-xxhdpi` under the `res` folder in your Android project.

## Author
Realtime.co
