import {types} from 'mobx-state-tree';

export const DrawerStore = types.model('DrawerStore', {
  lockMode: 'locked-closed',
  needLogin: false,
  navigatedToDelivery: false
})
  .actions(self => ({
    lock() {
      self.lockMode = 'locked-closed';
    },
    unlock() {
      self.lockMode = 'unlocked';
    },
    setNeedLogin(value) {
      self.needLogin = value;
    },
    setNavigatedToDelivery(value) {
      self.navigatedToDelivery = value;
    }
  }))
  .views(self => ({
    get unlocked() {
      return self.lockMode === 'unlocked';
    }
  }));
export const Drawer = DrawerStore.create();