import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
  apiKey: 'AIzaSyAEHBdFu9LCfTvAbaK0SBuDr5wOambz8bA',
  authDomain: 'ecatalogue-fdbcd.firebaseapp.com',
  databaseURL: 'https://ecatalogue-fdbcd.firebaseio.com',
  projectId: 'ecatalogue-fdbcd',
  storageBucket: 'ecatalogue-fdbcd.appspot.com',
  messagingSenderId: '913887357485',
  appId: '1:913887357485:web:78f8d3adfdb04ae2'
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const storage = firebase.storage()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const masterInfosCollection = db.collection('master')
const usersCollection = db.collection('users')
const itemsCollection = db.collection('items')
const categoriesCollection = db.collection('categories')
const brandsCollection = db.collection('brands')
const userpermissionsCollection = db.collection('userpermissions')

export {
  db,
  auth,
  storage,
  currentUser,
  masterInfosCollection,
  usersCollection,
  itemsCollection,
  categoriesCollection,
  brandsCollection,
  userpermissionsCollection
}
