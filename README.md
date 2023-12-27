# TrackWalk

Application for recording and measuring walks TrackWalk is a mobile application dedicated to Android, which was created in the React Native framework on the Expo platform. TrackWalk allows you to track and draw routes on a map as well as measure speed, time and walking distance.

Saved walks are stored in a local database and are written and drawn on the application's home screen and on the map screen. Users can delete activities at their discretion. When attempting to delete an activity, the app (if such security methods are used on the device) requires authorization via a fingerprint or face scanner. Moreover, the application also allows you to view aggregate statistics of recorded activities and overlay all routes on one map for a clear overview of the most frequently visited areas.


## Used Tools
- TypeScript 5.1.3
- React 18.2.0
- React Native 0.72.6
- React Navigation 6.1.9
- React Native Maps 1.7.1
- React Native Gifted Charts 1.3.26
- Expo 49.0.15
  - Expo Location 16.1.0
  - Expo SQLite 11.3.3
  - Expo LocalAuthentication 13.4.1
  - Expo Camera 13.4.4
- Font Awesome 6.5.1

## Requirements

For running the application you need:

- [Node.js](https://nodejs.org/en)
- [Expo](https://docs.expo.dev/get-started/installation/)
- Android Emulator or connection with phone by [Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pl&gl=PL) app

## How to run

1. Execute command `git clone https://github.com/Ilvondir/track-walk`.
2. Execute command `npm run android` in project catalog.


## First Look

![firstlook](assets/firstlook.jpg?raw=true)
