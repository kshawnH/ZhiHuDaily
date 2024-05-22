import { useNavigate, useLocation, useParams, useSearchParams, useMatch } from 'react-router-dom'
import routes from './routes'

export default function useRouteInfo(item) {
    let navigate = useNavigate(),
        location = useLocation(),
        params = useParams(),
        query = useSearchParams()[0],
        match = useMatch(location.pathname),
        route = null
    if (item) {
        route = item
    } else {
        let [, name] = location.pathname.match(/^\/([^/?#]*)/) || []
        if (!name) name = 'home'
        item = routes.find(item => item.name === name)
        if (item) route = item
    }
    const options = {
        navigate,
        location,
        params,
        query,
        match,
        route
    }
    return options
}