import { combineReducers } from 'redux'
import baseReducer from './baseReducer'
import collectReducer from './collectReducer'

const reducer = combineReducers({
    base: baseReducer,
    collect: collectReducer
})
export default reducer