import {createStore,combineReducers,applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import forgotReducer from '../reducers/forgot-reducer'
import resetReducer from '../reducers/reset-reducer'
const configureStore=()=>{
    const store=createStore(combineReducers({
        forgot:forgotReducer,
        reset:resetReducer
    }),applyMiddleware(thunk))
    return store
}
export default configureStore