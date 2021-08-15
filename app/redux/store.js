import {applyMiddleware, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducer from './reducers';

const middleWare = applyMiddleware(thunk);
export default createStore(reducer, composeWithDevTools(middleWare));
