const MainContainer = ({children}) => {
    return (
        <div className="flex flex-col bg-gray-800 p-2 overflow-y-scroll container-snap select-none rounded-2xl my-2 mx-1 border border-gray-700">
            {children}
        </div>
    )
}

export { MainContainer }
