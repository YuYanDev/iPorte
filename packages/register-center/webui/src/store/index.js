import { createStore } from "redux";
import langConfig from '../config/i18n'

const initialState = {
  navbarkey: "application",
  lang: langConfig['zh_CN']
};

const setnavbarkey = (state, action) => {
  return { ...state, navbarkey: action.navbarkey };
};

const setLang = (state, action) => {
  return { ...state, lang: langConfig[action.lang] };
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_NAVBAR_KEY":
      return setnavbarkey(state, action);
    case "SET_LANG":
      return setLang(state, action)
    default:
      return state;
  }
};

export default createStore(reducer);
