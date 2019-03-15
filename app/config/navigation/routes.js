import {ImageIcons} from '../../assets/icons';
import * as Screens from '../../screens';
import {
  LANDING_SCREEN,
  SUPPORT_SCREEN,
  FAQ_SCREEN,
  LOADER_SCREEN,
  ADDRESSES_SCREEN,
  LOGIN_SCREEN,
  SIGN_UP_SCREEN,
  PASSWORD_SCREEN,
  MAP_ADDRESS_SCREEN,
  MAP_FORM_ADDRESS_SCREEN,
  SEARCH_SCREEN,
  CHAT_SCREEN,
  TERMS_SCREEN,
  PROFILE_SCREEN,
  PROFILE_SETTINGS_SCREEN,
  ADD_CHAT_SCREEN,
  FEEDBACK_SCREEN,
  THANK_YOU_SCREEN, MAP_DELIVERY_TIME_SCREEN,
} from '../../models/Constants';
import {Dictionary} from '../../service/dictionary';

const customerMenu = [
  {
    id: LANDING_SCREEN,
    title: Dictionary.value('routeMain'),
    icon: ImageIcons.person,
    screen: Screens.Landing,
    children: []
  },
  {
    id: SUPPORT_SCREEN,
    title: Dictionary.value('support'),
    icon: ImageIcons.person,
    screen: Screens.Support,
    children: []
  },
  {
    id: ADDRESSES_SCREEN,
    title: Dictionary.value('addresses'),
    icon: ImageIcons.person,
    screen: Screens.Addresses,
    children: []
  },
  {
    id: MAP_DELIVERY_TIME_SCREEN,
    title: Dictionary.value('address'),
    icon: ImageIcons.person,
    screen: Screens.MapDeliveryTime,
    children: []
  },
  {
    id: FAQ_SCREEN,
    title: 'FAQ',
    icon: ImageIcons.person,
    screen: Screens.FAQ,
    children: []
  }];

export const Menus = {
  'Customer': customerMenu,
  'Anonymous': [
    {
      id: LOADER_SCREEN,
      title: Dictionary.value('routeMain'),
      icon: ImageIcons.person,
      screen: Screens.Loader,
      children: []
    },
    {
      id: FAQ_SCREEN,
      title: 'FAQ',
      icon: ImageIcons.person,
      screen: Screens.FAQ,
      children: []
    }
  ]
};

export const MenuRoutes = [
  {
    id: LANDING_SCREEN,
    title: 'Main',
    screen: Screens.Landing,
    children: []
  },
  {
    id: ADDRESSES_SCREEN,
    title: 'Addresses',
    icon: ImageIcons.person,
    screen: Screens.Addresses,
    children: []
  },
  {
    id: LOGIN_SCREEN,
    title: 'Login',
    screen: Screens.Login,
    children: []
  },
  {
    id: SIGN_UP_SCREEN,
    title: 'Sign Up',
    screen: Screens.SignUp,
    children: []
  },
  {
    id: PASSWORD_SCREEN,
    title: 'Password Recovery',
    screen: Screens.PasswordRecovery,
    children: []
  },
  {
    id: MAP_ADDRESS_SCREEN,
    title: 'Address',
    screen: Screens.MapAddress,
    children: []
  },
  {
    id: MAP_FORM_ADDRESS_SCREEN,
    title: 'Address',
    screen: Screens.MapFormAddress,
    children: []
  },
  {
    id: SEARCH_SCREEN,
    title: 'Search',
    screen: Screens.Search,
    icon: ImageIcons.profile,
    children: []
  },
  {
    id: CHAT_SCREEN,
    title: 'Chat',
    screen: Screens.Chat,
    icon: ImageIcons.profile,
    children: []
  },
  {
    id: TERMS_SCREEN,
    title: 'Terms & Conditions',
    icon: ImageIcons.person,
    screen: Screens.Terms,
    children: []
  },
  {
    id: PROFILE_SCREEN,
    title: 'Profile',
    screen: Screens.Profile,
    icon: ImageIcons.person,
    children: []
  },
  {
    id: PROFILE_SETTINGS_SCREEN,
    title: 'Profile Settings',
    screen: Screens.ProfileSettings,
    children: []
  },
  {
    id: ADD_CHAT_SCREEN,
    title: 'Add Chat',
    screen: Screens.AddChat,
    children: []
  },
  {
    id: FEEDBACK_SCREEN,
    title: 'Feedback',
    screen: Screens.Feedback,
    children: []
  },
  {
    id: THANK_YOU_SCREEN,
    title: 'Thank you',
    screen: Screens.ThankYou,
    children: []
  },
  ...Object.keys(Menus).reduce((a, k) => a.concat(Menus[k]), [])
];