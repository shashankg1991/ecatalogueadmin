import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
  apiKey: 'AIzaSyAEHBdFu9LCfTvAbaK0SBuDr5wOambz8bA',
  authDomain: 'ecatalogue-fdbcd.firebaseapp.com',
  databaseURL: 'https://ecatalogue-fdbcd.firebaseio.com',
  projectId: 'ecatalogue-fdbcd',
  storageBucket: ''
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const itemsCollection = db.collection('items')
const categoriesCollection = db.collection('categories')

export {
  db,
  auth,
  currentUser,
  usersCollection,
  itemsCollection,
  categoriesCollection
}
