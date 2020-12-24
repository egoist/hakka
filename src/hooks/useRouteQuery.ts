import React from 'react'
import qs from 'querystringify'
import { useLocation } from 'react-router-dom'

export const useRouteQuery = (): any => {
  const location = useLocation()
  const query = React.useMemo(() => {
    return qs.parse(location.search)
  }, [location.search])
  return query
}
