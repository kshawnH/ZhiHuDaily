import useRouteInfo from "./useRouteInfo"

export default function withRouter(Component) {
    return function (props) {
        const options = useRouteInfo()
        return <Component {...props} {...options} />
    }
}