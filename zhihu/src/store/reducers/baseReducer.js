import * as AT from '../action-types'

let initial = {
    profile: null
}
export default function baseReducer(state = initial, action) {
    state = { ...state }
    let { type } = action
    switch (type) {
        case AT.BASE_QUERY_USER_INFO:
            state.profile = action.profile
            break
        case AT.BASE_REMOVE_USER_INFO:
            state.profile = null
            break
        default:
    }
    return state
}