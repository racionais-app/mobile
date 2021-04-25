import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';

const transform = snapshot => snapshot
  .docs
  .map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

class Module {
  subs = [];
  items = [];
  done = [];
  data = [];

  constructor(mid, callback) {
    this.itemsUnsub = firestore()
      .collection('modules')
      .doc(mid)
      .collection('items')
      .orderBy('order', 'asc')
      .onSnapshot(documentSnapshot => {
        this.onSnapshotItems(transform(documentSnapshot));
      });

    this.userUnsub = firestore()
      .collection('users')
      .doc(DeviceInfo.getUniqueId())
      .onSnapshot(documentSnapshot => {
        this.onSnapshotUser(documentSnapshot.data());
      });

    this.callback = callback;
  }

  onSnapshotItems(i) {
    this.items = i;
    this.data = i.map(item => ({
      ...item,
      completed: this.done.includes(item.id)
    }));
    this.callback(this.data);
  }

  onSnapshotUser(user) {
    this.done = user.done || [];
    this.data = this.items.map(item => ({
      ...item,
      completed: this.done.includes(item.id)
    }));
    this.callback(this.data);
  }

  unsubscribe() {
    this.itemsUnsub?.();
    this.userUnsub?.();
  }
}

export default Module;
